import axios from "axios";
const baseUrl = "http://localhost:3001/persons";

const getAll = () => {
  return axios.get(baseUrl).then((response) => response.data);
};

const addNew = (newPerson) => {
  return axios.post(baseUrl, newPerson).then((response) => response.data);
};

const deleteRecord = (id) => {
  return axios.delete(`${baseUrl}/${id}`);
};

const updateNumber = (id, updatedRecord) => {
  return axios
    .put(`${baseUrl}/${id}`, updatedRecord)
    .then((response) => response.data);
};

export default { getAll, addNew, deleteRecord, updateNumber };
