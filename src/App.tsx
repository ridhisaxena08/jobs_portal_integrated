import { useState } from "react";
import { supabase } from "./supabase";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from("profiles")
      .insert([{ name, email, role }]);

    if (error) {
      alert("Error: " + error.message);
      return;
    }

    alert("Data saved successfully ✅");
    setName("");
    setEmail("");
    setRole("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Job Portal Form</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <br /><br />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;