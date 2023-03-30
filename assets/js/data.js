import { initializeApp } from "firebase/app";
import { getDatabase, set, ref, update, get, onValue } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";

    const firebaseConfig = {
        apiKey: "AIzaSyAJJ1jNoWHUMQWPvEXKsbUCsMv-_AZWCJM",
        authDomain: "authentication-79f66.firebaseapp.com",
        databaseURL: "https://authentication-79f66-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "authentication-79f66",
        storageBucket: "authentication-79f66.appspot.com",
        messagingSenderId: "924065369111",
        appId: "1:924065369111:web:b671557911b4ca66ab2052"
    };
    const app = initializeApp(firebaseConfig);
    const database = getDatabase();
    const auth = getAuth();

    // Создание пользователя
    export function createUser(email, password, modalOpen){
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            set(ref(database, 'users/' + user.uid), {
                email: email
            });
            modalOpen('Регистрация прошла успешно!');
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            alert(errorMessage);
        });
    }
    
    // Вход пользователя
    export function signInUser(email, password, modalOpen){
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const dt = new Date();
            update(ref(database, 'users/' + user.uid), {
                last_login: dt
            });
            modalOpen('Вход в систему прошел успешно!');
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage);
        });
    }

    //Получение данных из БД
    export function getUser(usersList){
        let count = 1;
        const userRef = ref(database, 'users/');
        onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            Object.values(data).forEach(elem => {
                const item = document.createElement('div');
                item.innerHTML = `${count++}. ${elem.email}`;
                usersList.append(item);
                console.log(elem.email);
            });
        });
    }