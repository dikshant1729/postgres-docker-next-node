import React , {useState , useEffect} from 'react';
import axios from 'axios';
import CardComponent from '../components/CardComponent';

interface User {
    id: number;
    name: string;
    email: string;
}

export default function Home() {
  const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const [users , setUsers] = useState<User[]>([]);
  const [newUser , setNewUser] = useState({name: '' , email: ''});
  const [updateUser, setUpdateUser] = useState({ id: '', name: '', email: '' });

  //fetch users
  useEffect( () => {
     const fetchData  = async () => {
      try{
        const response = await axios.get(`${apiURL}/users`);
        setUsers(response.data.reverse());
      } catch (error) {
        console.error('Error fetching data' , error);
      }
     };
     fetchData();
  } , []);

  //create user
  const createUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
      if(newUser.name!=='' && newUser.email!==''){
        try{
          const response = await axios.post(`${apiURL}/users` , newUser);
          setUsers([response.data , ...users]);
          setNewUser({name: '' , email: ''})
        } catch (error) {
          console.error('Error creating user' , error);
        }
      }
      else{
        alert('Please fill all the fields');
      }
    
  };

  // update user
  const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(updateUser.name!=='' && updateUser.email!=='' && updateUser.id!=='') {
      try {
        await axios.put(`${apiURL}/users/${updateUser.id}`, { name: updateUser.name, email: updateUser.email });
        setUpdateUser({ id: '', name: '', email: '' });
        setUsers(
          users.map((user) => {
            if (user.id === parseInt(updateUser.id)) {
              return { ...user, name: updateUser.name, email: updateUser.email };
            }
            return user;
          })
        );
      } catch (error) {
        console.error('Error updating user:', error);
      }
    }
    else{
      alert('Please fill all the fields');
    }
   
  };

  // delete user
  const deleteUser = async (id: number) => {
    try {
      await axios.delete(`${apiURL}/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };


   return (
    <main className="flex item-center justify-center min-h-screen p-4 bg-gray-100">
      <div className='space-y-4 w-full max-w-2xl'>
      <h1 className='text-2xl font-bod text-gray-800 text-center'>User Management App</h1>

      {/* create user */}
      <form onSubmit = {createUser} className = "p-4 bg-blue-100 rounded shadow">
        <input 
        placeholder='Name'
        value = {newUser.name}
        onChange = {(e) => setNewUser({ ...newUser , name: e.target.value})}
        className = "mb-2 w-full p-2 border border-gray-300 rounded"
        />
        <input 
        placeholder='Email'
        value = {newUser.email}
        onChange = {(e) => setNewUser({ ...newUser , email: e.target.value})}
        className = "mb-2 w-full p-2 border border-gray-300 rounded"
        />
        <button type = "submit" className='w-full p-2 text-white rounded hover:bg-blue-600 bg-blue-500'>
          Add User
        </button>
      </form>

      {/* Update user */}
      <form onSubmit = {handleUpdateUser} className = "p-4 bg-green-100 rounded shadow">
        <input 
          placeholder='User ID'
          value = {updateUser.id}
          onChange={ (e) => setUpdateUser({...updateUser , id:e.target.value})}
          className='mb-2 w-full p-2 border border-gray-300 rounded'
        />
        <input 
          placeholder='New Name'
          value = {updateUser.name}
          onChange={ (e) => setUpdateUser({...updateUser , name:e.target.value})}
          className='mb-2 w-full p-2 border border-gray-300 rounded'
        />
        <input 
          placeholder='New Mail'
          value = {updateUser.email}
          onChange={ (e) => setUpdateUser({...updateUser , email:e.target.value})}
          className='mb-2 w-full p-2 border border-gray-300 rounded'
        />
        <button type="submit" className='w-full p-2 text-white bg-green-500 rounded hover:bg-green-600'>
         update User
        </button>
      </form>

      {/* Display Users */}
       <div className='space-y-2'>
        {users.map((user) => (
          <div key = {user.id} className='flex item-center justify-between bg-white p-4 rounded-lg shadow'>
            <CardComponent card = {user} />
            <button onClick={() => deleteUser(user.id)} className='px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded'>
              Delete User
              </button>
          </div>
          ))}

        </div>
      </div>
    </main>
   )
}