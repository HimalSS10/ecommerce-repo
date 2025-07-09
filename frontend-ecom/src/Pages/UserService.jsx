import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UserService() {
  const users1 = [
    { id: 1, name: "Alice Smith", email: "alice@example.com" },
    { id: 2, name: "Bob Johnson", email: "bob@example.com" },
    { id: 3, name: "Charlie Lee", email: "charlie@example.com" },
    { id: 4, name: "Diana King", email: "diana@example.com" },
    { id: 5, name: "Ethan Brown", email: "ethan@example.com" },
  ];
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [password, setNewPassword] = useState("");

  const API_GATEWAY_URL = "https://ecomservice.squareshift.dev";

  console.log(API_GATEWAY_URL,"API_GATEWAY_URL");
  

  useEffect(() => {
    axios
      .get(`${API_GATEWAY_URL}/users/info`)
      .then((res) => setUsers(res.data.users));
  }, []);

  return (
    <div className="full-page">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
          paddingTop: "100px"
        }}
      >
        <div style={{ flex: 1 }}></div>
        <div style={{ flex: "none", textAlign: "center" }}>
          <h2 style={{ margin: 0 }}>Users</h2>
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={() => setShowModal(true)}
            style={{
              padding: "0.5rem 0.7rem",
              fontSize: "1rem",
              borderRadius: "5px",
              border: "none",
              background: "#1976d2",
              color: "#fff",
              cursor: "pointer",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}
          >
            Create User
          </button>
        </div>
      </div>

      {/* Modal for creating user */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "2rem",
              borderRadius: "8px",
              minWidth: "300px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              position: "relative",
            }}
          >
            <h3>Create User</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const res = await axios.post(
                    `${API_GATEWAY_URL}/users/create`,
                    { name: newName, email: newEmail, password: password }
                  );
                  // If API returns the created user, use it; else, fallback to local
                  const createdUser =
                    res.data && res.data.id
                      ? res.data
                      : {
                          id:
                            users.length > 0
                              ? Math.max(...users.map((u) => u.id)) + 1
                              : 1,
                          name: newName,
                          email: newEmail,
                          password: newPassword,
                        };
                  setUsers([...users, createdUser]);
                } catch (err) {
                  // fallback: add locally if API fails
                  const newId =
                    users.length > 0
                      ? Math.max(...users.map((u) => u.id)) + 1
                      : 1;
                  setUsers([
                    ...users,
                    {
                      id: newId,
                      name: newName,
                      email: newEmail,
                      password: newPassword,
                    },
                  ]);
                }
                setNewName("");
                setNewEmail("");
                setNewPassword("");
                setShowModal(false);
              }}
            >
              <div style={{ marginBottom: "1rem" }}>
                <label>
                  Name:
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                    style={{ marginLeft: "0.5rem" }}
                  />
                </label>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label>
                  Email:
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                    style={{ marginLeft: "0.5rem" }}
                  />
                </label>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label>
                  Password: 
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    style={{ marginLeft: "0.5rem" }}
                  />
                </label>
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  type="submit"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setNewName("");
                    setNewEmail("");
                    setNewPassword("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>ID</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Name</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {user.id}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {user.name}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {user.email}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
