export default (access_token) => {
  return new Promise((resolve, reject) => {
    fetch(
      `https://graph.facebook.com/v9.0/me?access_token=${access_token}&fields=name,email,picture&method=get&pretty=0&sdk=joey&suppress_http_code=1`
    )
      .then((res) => res.json())
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};
