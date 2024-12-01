<script>
  let query = "";
  let tableData = [
    { column1: "Row 1 Col 1", column2: "Row 1 Col 2", column3: "Row 1 Col 3" },
    { column1: "Row 2 Col 1", column2: "Row 2 Col 2", column3: "Row 2 Col 3" },
    { column1: "Row 3 Col 1", column2: "Row 3 Col 2", column3: "Row 3 Col 3" },
  ];
  let isQuerySubmitted = false;

  function submitQuery() {
    // Placeholder for query submission logic
    console.log("Query submitted:", query);
    isQuerySubmitted = true;
  }

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      submitQuery();
    }
  }
</script>

<div class="input-container">
  <input
    class="query-input"
    type="text"
    placeholder="Enter your query"
    bind:value={query}
    on:keypress={handleKeyPress}
  />
  <button class="submit-button" on:click={submitQuery}>Submit</button>
</div>

{#if isQuerySubmitted}
  <table class="table-container">
    <thead>
      <tr>
        <th>Column 1</th>
        <th>Column 2</th>
        <th>Column 3</th>
      </tr>
    </thead>
    <tbody>
      {#each tableData as row}
        <tr>
          <td>{row.column1}</td>
          <td>{row.column2}</td>
          <td>{row.column3}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}

<style>
  .input-container {
    display: flex;
    justify-content: center;
    margin: 2em 0;
    min-width: 300px;
  }

  .query-input {
    font-size: 1.2em;
    padding: 0.5em;
    width: 70%;
    margin-right: 0.5em;
  }

  .submit-button {
    font-size: 1.2em;
    padding: 0.5em 1em;
    cursor: pointer;
  }

  .table-container {
    max-width: 80%;
    margin: 0 auto;
    border-collapse: collapse;
  }

  .table-container th,
  .table-container td {
    border: 1px solid #ddd;
    padding: 0.8em;
    text-align: left;
  }

  .table-container th {
    background-color: #f4f4f4;
  }
</style>
