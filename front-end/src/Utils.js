// Functions for creating a user
export function validateName(name) {};

export function validateSurname(surname) {};

export function validateEmail(email) {};

export function validatePassword(password) {};

export function validatePasswordMatch(password, confirmPassword) {};

export async function createUserAccount(name, surname, email, password) {}; // maybe create hash only and send it to database instead


// Functions for logging in and logging out of the user
export async function checkUserExists(email) {};

export async function logInUser(email, password) {}; // maybe compare on device and only send hash to backend

export async function logOutUser() {};


// Other necessary functions rework
