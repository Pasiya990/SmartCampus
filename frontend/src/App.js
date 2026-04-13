// import { useEffect, useState } from "react";

// function App() {
//   const [message, setMessage] = useState("Connecting...");

//   useEffect(() => {
//     fetch(process.env.REACT_APP_API_URL + "/test")
//       .then((res) => res.json())
//       .then((data) => {
//         console.log(data);

//         if (data.length >= 0) {
//           setMessage("PostgresSQL Connected Successfully ✅");
//         }
//       })
//       .catch((err) => {
//         console.error(err);
//         setMessage("Connection Failed ❌");
//       });
//   }, []);

//   return (
//     <div style={{ textAlign: "center", marginTop: "50px" }}>
//       <h1>SmartCampus</h1>
//       <h2>{message}</h2>
//     </div>
//   );
// }

// export default App;

import ResourceCatalogue from "./pages/ResourceCatalogue";

function App() {
  return <ResourceCatalogue />;
}

export default App;