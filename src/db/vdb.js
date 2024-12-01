/**
 * ChromeVectorDB: Optimized Vector Database for Chrome Extensions
 * Designed for local AI agent functionality with Gemini Nano
 *
 * @example
 *
 * // Memorizing information
 *   await memorize({
 *     content: "My favorite programming language is JavaScript",
 *     category: 'personal_preferences',
 *     metadata: { source: 'user_conversation' }
 *   });
 *
 *  // Recalling similar memories
 *   const recallResults = await recall({
 *     query: "What programming languages do you like?",
 *     category: 'personal_preferences'
 *   });
 *
 */
class ChromeVectorDB {
  /**
   * Initialize the vector database
   * @param {Object} options - Configuration options
   * @param {string} [options.name='LocalAIVectors'] - IndexedDB database name
   * @param {number} [options.version=1] - Database version
   * @param {number} [options.dimensionality=384] - Default vector dimensionality
   * @param {number} [options.maxVectors=10000] - Maximum number of vectors to store
   */
  constructor(options = {}) {
    this.options = {
      name: options.name || "LocalAIVectors",
      version: options.version || 1,
      dimensionality: options.dimensionality || 384, // Default for many embedding models
      maxVectors: options.maxVectors || 10000,
    };

    this.db = null;
    this._initDatabase();
  }

  /**
   * Initialize IndexedDB database
   * @private
   * @returns {Promise<void>}
   */
  _initDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.options.name, this.options.version);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create object stores
        if (!db.objectStoreNames.contains("vectors")) {
          const vectorStore = db.createObjectStore("vectors", {
            keyPath: "id",
            autoIncrement: true,
          });

          // Create indexes for efficient querying
          vectorStore.createIndex("embedding", "embedding", { unique: false });
          vectorStore.createIndex("metadata", "metadata", { unique: false });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve();
      };

      request.onerror = (event) => {
        console.error("IndexedDB initialization error:", event.target.error);
        reject(event.target.error);
      };
    });
  }

  /**
   * Validate and normalize input vector
   * @private
   * @param {number[]} vector - Input vector
   * @returns {number[]} Normalized vector
   * @throws {Error} If vector is invalid
   */
  _processVector(vector) {
    // Validate vector dimensionality
    if (vector.length !== this.options.dimensionality) {
      throw new Error(
        `Vector must be ${this.options.dimensionality} dimensional`,
      );
    }

    // Normalize vector
    const magnitude = Math.sqrt(
      vector.reduce((sum, val) => sum + val * val, 0),
    );

    return magnitude > 0 ? vector.map((val) => val / magnitude) : vector;
  }

  /**
   * Compute cosine similarity between two vectors
   * @param {number[]} v1 - First vector
   * @param {number[]} v2 - Second vector
   * @returns {number} Cosine similarity score
   */
  cosineSimilarity(v1, v2) {
    return v1.reduce((sum, val, i) => sum + val * v2[i], 0);
  }

  /**
   * Add a vector to the database
   * @param {number[]} embedding - Vector embedding
   * @param {Object} [metadata={}] - Associated metadata
   * @returns {Promise<number>} Added vector's ID
   */
  async add(embedding, metadata = {}) {
    if (!this.db) await this._initDatabase();

    const processedVector = this._processVector(embedding);

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["vectors"], "readwrite");
      const store = transaction.objectStore("vectors");

      const record = {
        embedding: processedVector,
        metadata,
        timestamp: Date.now(),
      };

      const request = store.add(record);

      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = (event) => reject(event.target.error);
    });
  }

  /**
   * Search for similar vectors
   * @param {number[]} queryVector - Query vector
   * @param {Object} options - Search options
   * @param {number} [options.k=5] - Number of results to return
   * @param {number} [options.threshold=0.7] - Similarity threshold
   * @param {Object} [options.filter={}] - Metadata filter
   * @returns {Promise<Object[]>} Similar vectors
   */
  async search(queryVector, options = {}) {
    if (!this.db) await this._initDatabase();

    const { k = 5, threshold = 0.7, filter = {} } = options;

    const processedQuery = this._processVector(queryVector);

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["vectors"], "readonly");
      const store = transaction.objectStore("vectors");
      const request = store.getAll();

      request.onsuccess = (event) => {
        const allVectors = event.target.result;

        // Filter and score vectors
        const scoredVectors = allVectors
          .filter((vec) => {
            // Apply metadata filter if provided
            return Object.entries(filter).every(
              ([key, value]) => vec.metadata[key] === value,
            );
          })
          .map((vec) => ({
            ...vec,
            similarity: this.cosineSimilarity(processedQuery, vec.embedding),
          }))
          .filter((vec) => vec.similarity >= threshold)
          .sort((a, b) => b.similarity - a.similarity)
          .slice(0, k);

        resolve(scoredVectors);
      };

      request.onerror = (event) => reject(event.target.error);
    });
  }

  /**
   * Clear all vectors from the database
   * @returns {Promise<void>}
   */
  async clear() {
    if (!this.db) await this._initDatabase();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["vectors"], "readwrite");
      const store = transaction.objectStore("vectors");
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = (event) => reject(event.target.error);
    });
  }
}

/**
 * Create a ChromeVectorDB instance with Gemini Nano embedding compatibility
 * @returns {ChromeVectorDB} Configured vector database
 */
function createLocalAIVectorDB() {
  return new ChromeVectorDB({
    name: "GeminiNanoVectors",
    dimensionality: 384, // Typical embedding size for small models
    maxVectors: 5000, // Reasonable limit for local storage
  });
}

export { ChromeVectorDB, createLocalAIVectorDB };
