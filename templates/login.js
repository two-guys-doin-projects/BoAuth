const {html} = require('html-express-js');

const view = (data, state) => html`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
* {
    box-sizing: border-box;
}
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}
.login-container {
    position: relative;
    width: 22.2rem;
}
.form-container {
    border: 1px solid hsla(0, 0%, 1%, 0.158);
    background-color: rgb(236, 236, 236);
    border-radius: 10px;
    backdrop-filter: blur(20px);
    padding: 2rem;
}
.login-container form input {
    display: block;
    padding: 14.5px;
    width: 100%;
    margin: 2rem 0;
    color: var(--color);
    outline: none;
    background-color: #9191911f;
    border: none;
    border-radius: 5px;
    font-weight: 500;
    letter-spacing: 0.8px;
    font-size: 15px;
    backdrop-filter: blur(15px);
}
.login-container form button {
    background-color: var(--primary-color);
    color: var(--color);
    display: block;
    padding: 13px;
    border-radius: 5px;
    outline: none;
    font-size: 18px;
    letter-spacing: 1.5px;
    font-weight: bold;
    width: 100%;
    cursor: pointer;
    margin-bottom: 2rem;
    border: none;
}
.login-container form button:hover {
    box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.15);
}
    </style>
</head>
<body>
    <section class="container">
        <div class="login-container">
            <div class="form-container">
                <h1 class="opacity">LOGIN</h1>
                <form action="" method="post">
                    <input type="text" placeholder="USERNAME" />
                    <input type="password" placeholder="PASSWORD" />
                    <button class="opacity">SUBMIT</button>
                    <input type="hidden" name="returnTo" value="${data.redirect}">
                </form>
            </div>
            
        </div>
        <button type="submit" class="theme-btn-container" />
    </section>
</body>
</html>
`

module.exports = {view}