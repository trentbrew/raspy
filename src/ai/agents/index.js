import { Agent } from "./base";

import developer from "./developer";
import assistant from "./assistant";
import designer from "./designer";
import writer from "./writer";

// Export base agent class for extending
export { Agent };

// Export configured agent instances
export { developer, assistant, designer, writer };

// Export default developer agent
export default developer;
