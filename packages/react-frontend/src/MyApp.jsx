import React, { useState, useEffect } from "react"
import Table from "./Table"
import Form from "./Form"


  function MyApp() {
    const [characters, setCharacters] = useState([]);
  
    function removeOneCharacter(index) {
        const deletedChar = characters[index];
        fetch(`http://localhost:8000/users/${deletedChar._id}`, {
          method: "DELETE"
        })
        .then((response) => {
          if (response.status === 204) {
            const updated = characters.filter((_, i) => i !== index);
            setCharacters(updated);
          } else if (response.status === 404) {
            console.log("User Not Found.");
          } else {
            throw new Error("Failed to Delete.");
          }
        })
        .catch((error) => {
          console.error("Error during deletion:", error);
        });
      }
    
    function updateList(person) {
      postUser(person)
      .then((createdUser) => setCharacters([...characters, createdUser]))
      .catch((error) => {
        console.log(error);
      });
    }

    function fetchUsers() {
      const promise = fetch("http://localhost:8000/users");
      return promise;
    }

    function postUser(person) {
      const promise = fetch("http://localhost:8000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(person)
      })
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } else {
          throw new Error("User Creation Failed, Will Not Update.");
        }
      });
    
      return promise;
    }

    useEffect(() => {
      fetchUsers()
        .then((res) => res.json())
        .then((json) => setCharacters(json["users_list"]))
        .catch((error) => {
          console.log(error);
        });
    }, []);
    
    return (
        <div className="container">
          <Table
            characterData={characters}
            removeCharacter={removeOneCharacter}
          />
          <Form handleSubmit = {updateList} />
        </div>
    );
}

export default MyApp;