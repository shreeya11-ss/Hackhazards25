import { Client, Account,ID } from 'appwrite';

const client = new Client();

client
  .setEndpoint('https://fra.cloud.appwrite.io/v1') // Replace with your Appwrite endpoint
  .setProject('67ffdf480008863e869e'); // Replace with your project ID


const account = new Account(client);

// Create phone session
// Function to create a phone session and send OTP
const createPhoneSession = async (phoneNumber) => {
  try {
    // Send OTP to the provided phone number
    const response = await account.createPhoneToken(ID.unique(),phoneNumber)
    console.log('OTP sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Error creating phone session:', error);
    throw error;
  }
};
const getCurrentUserId = async () => {
  try {
    const user = await account.get();
    return user.$id;
  } catch (error) {
    console.error("Error getting current user:", error);
    throw error; // Important: Re-throw the error!
  }
};




export { client, account,createPhoneSession ,getCurrentUserId};

