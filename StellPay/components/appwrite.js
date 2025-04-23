import { Client, Account, ID , Databases } from 'appwrite';
const { unique } = ID;

const client = new Client();

client
  .setEndpoint('https://fra.cloud.appwrite.io/v1') // Replace with your Appwrite endpoint
  .setProject('67ffdf480008863e869e'); // Replace with your project ID


const account = new Account(client);
const databases = new Databases(client);

// Create phone session
// Function to create a phone session and send OTP
async function registerUser({ name, email, password, phone }) {
  try {
    // Step 1: Create User
    const user = await account.create(ID.unique(), email, password);

    // Step 2: Update User Name
    await account.updateName(name);

    // Step 3: Save Phone Number to Appwrite Database
    const session = await account.createEmailPasswordSession(email, password); // To get user ID
    const userInfo = await account.get();

    // Save phone in custom DB
    await databases.createDocument(
      '68074759002d0166d81e',     // Replace with your DB ID
      '68074786001558768fb4',   // Replace with your Collection ID
      ID.unique(),
      {
        userId: userInfo.$id,
        phone: phone,
        name: name,
        email: email
      }
    );

    console.log('✅ Registration complete');
  } catch (err) {
    console.error('❌ Error during registration:', err.message);
  }
}

export { client, account,databases,registerUser,ID};

