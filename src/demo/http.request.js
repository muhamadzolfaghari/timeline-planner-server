fetch('auth/login', {
  method: 'post',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'john', password: 'changeme' }),
}).then((res) => {
  res.json().then(({ access_token }) => {
    fetch('auth/profile', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
    }).then((res) => {
      res.json().then((data) => {
        console.log(data);
      });
    });
  });
});
