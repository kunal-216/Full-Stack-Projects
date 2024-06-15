import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getTransactions().then(setTransactions).catch(err => console.error('Error fetching transactions:', err));
  }, []);

  function getTransactions() {
    const url = import.meta.env.VITE_API_URL + '/transactions';
    return fetch(url).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    });
  }

  function addNewTransaction(e) {
    e.preventDefault();
    const url = import.meta.env.VITE_API_URL + '/transaction';
    const price = name.split(' ')[0];
    fetch(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        price,
        name: name.substring(price.length + 1),
        description,
        datetime,
      })
    }).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    }).then(json => {
      console.log('result', json);
      // Update the transactions state with the new transaction
      setTransactions([...transactions, json]);
    }).catch(err => console.error('Error adding transaction:', err));

    setName('');
    setDatetime('');
    setDescription('');
  }

  let balance = 0;
  for (const transaction of transactions) {
    balance += parseFloat(transaction.price);
  }
  balance = balance.toFixed(1);
  const fraction = balance.split('.')[1];

  return (
    <main>
      <h1>${balance}{fraction}</h1>
      <form onSubmit={addNewTransaction}>
        <div className="basic">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={'+200 new samsung tv'}
          />
          <input
            type="datetime-local"
            value={datetime}
            onChange={e => setDatetime(e.target.value)}
          />
        </div>
        <div className='description'>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder={'description'}
          />
        </div>
        <button type='submit'>Add new transaction</button>
      </form>
      <div className='transactions'>
        {transactions.length > 0 && transactions.map(transaction => (
          <div className="transaction" key={transaction._id}>
            <div className="left">
              <div className="name">{transaction.name}</div>
              <div className="description">{transaction.description}</div>
            </div>
            <div className="right">
              <div className={'price ' + (transaction.price < 0 ? 'red' : 'green')}>
                {transaction.price}$
              </div>
              <div className="datetime">{transaction.datetime}</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;
