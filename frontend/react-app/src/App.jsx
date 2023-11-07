import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [sample, setSample] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:8001/api/sample/') // DjangoサーバーのURLに合わせて変更してください
      .then(response => response.json())
      .then(data => {
        setSample(data.message); // この例では、dataがオブジェクトであり、messageを表示しています
      })
      .catch(error => console.error('Error:', error));
  }, []); // 空の依存リストを渡すことで、初回のレンダリング時にのみfetchリクエストを実行します

  return (
    <div>
      <h1>React and Django Test</h1>
      <p>{sample}</p>
    </div>
  );
}

export default App;
