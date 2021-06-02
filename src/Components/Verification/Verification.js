import React, { useState } from 'react';

export default function Verification() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Verification</p>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}