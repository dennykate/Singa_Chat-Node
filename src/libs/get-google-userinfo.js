const getGoogleUserInfo = async (access_token) => {
  return new Promise((resolve, reject) => {
    fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
    )
      .then((res) => res.json())
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};


export default getGoogleUserInfo;