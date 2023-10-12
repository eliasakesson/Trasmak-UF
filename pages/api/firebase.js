import admin from 'firebase-admin';

const serviceAccount = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEY);

if (!admin.apps.length){
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: 'https://uf-ecom-default-rtdb.europe-west1.firebasedatabase.app'
    });
}

const db = admin.database();

export { db };