import React, { useEffect, useState } from "react";
import { Button, TextField } from "@material-ui/core";
import axios from "axios";
import { useForm } from "react-hook-form";

import "./ContactForm.css";

function ContactForm() {
  const { register, handleSubmit, watch, errors } = useForm();
  const [tableData, setTableData] = useState([]);
  const [totalSalaries, setTotalSalaries] = useState(0);

  useEffect(() => {
    const total = tableData.reduce(
      (total, row) => (total = total + Number(row.salary)),
      0
    );

    setTotalSalaries(total);
  }, [tableData]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get("https://sheet.best/api/sheets/75e1d79f-6038-4590-85d9-ebbd257edc14")
      .then((response) => {
        console.log("google sheets data >>> ", response);
        setTableData(response.data);
      });
  };

  const submitFormToGoogle = (data) => {
    console.log("You submitted the form");
    axios
      .post(
        "https://sheet.best/api/sheets/75e1d79f-6038-4590-85d9-ebbd257edc14",
        data
      )
      .then((response) => {
        alert("Row successfully added");
        setTableData([...tableData, data]);
        console.log(response);
      })
      .catch((error) => alert(error.message));
  };

  return (
    <div className="contactForm">
      <h2>Annual expenses (Total salaries): £{totalSalaries}</h2>
      <table>
        <tbody>
          {tableData.map(({ age, hobby, name, salary }) => (
            <tr>
              <td>{age}</td>
              <td>{hobby}</td>
              <td>{name}</td>
              <td>{salary}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <form onSubmit={handleSubmit(submitFormToGoogle)}>
        <TextField
          name="name"
          error={errors.name}
          helperText={errors.name && "The Name is Required"}
          inputRef={register({ required: true })}
          label="Name"
        />
        <TextField
          name="age"
          type="number"
          error={errors.age}
          helperText={errors.age?.type === "required" && "The Age is required"}
          inputRef={register({
            required: true,
          })}
          label="Age"
        />

        {console.log(errors.age)}
        <TextField
          name="salary"
          error={errors.salary}
          helperText={errors.salary && "The Salary is Required"}
          inputRef={register({ required: true })}
          label="Salary"
        />
        <TextField
          name="hobby"
          error={errors.hobby}
          helperText={errors.hobby && "The Hobby is Required"}
          inputRef={register({ required: true })}
          label="Hobby"
        />
        <Button variant="outlined" type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
}

export default ContactForm;
