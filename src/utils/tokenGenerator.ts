export function generateAndSaveToken() {
  const oldToken = localStorage.getItem("token");
  if (!oldToken) {
    const characters = "abcdefghijklmnopqrstuvwxyz";
    let token = "guest_";
    for (let i = 0; i < 32; i++) {
      token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    localStorage.setItem("token", token);
    return token;
  }
  return oldToken;
}
