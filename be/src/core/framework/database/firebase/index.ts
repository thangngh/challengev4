import admin, { ServiceAccount } from 'firebase-admin';

class FirebaseService {
  private static instance: FirebaseService;
  private app: admin.app.App;
  private db: admin.firestore.Firestore;

  private constructor() {
    const serviceAccount: ServiceAccount = {
      projectId: CONFIG.firebase.projectId,
      clientEmail: CONFIG.firebase.clientEmail,
      privateKey: CONFIG.firebase.privateKey?.replace(/\\n/g, '\n'),
    };

    this.app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: CONFIG.firebase.databaseUrl,
    });

    this.db = admin.firestore();
  }

  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  public getFirestore(): admin.firestore.Firestore {
    return this.db;
  }
}

export default FirebaseService;