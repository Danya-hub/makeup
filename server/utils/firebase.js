import firebase from "../config/firebase.js";

class Firebase {
    async store(path, file) {
        return new Promise((resolve, reject) => {
            const storageRef = firebase.storage().ref(path);

            const uploadTask = storageRef.put(file);

            uploadTask.on("success", null, reject, async () => {
                const url = await uploadTask.snapshot.ref.getDownloadURL();

                resolve(url);
            });
        });
    }
}

export default new Firebase();