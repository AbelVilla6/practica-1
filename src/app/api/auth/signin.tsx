// // En SignInPage.tsx
// import { signIn } from 'next-auth/react';
// import { useRouter } from 'next/router';
// import React, { useState } from 'react';

// const SignInPage: React.FC = () => {
//   const router = useRouter();
//   const [credentials, setCredentials] = useState({
//     email: '',
//     password: '',
//   });

//   // Función para manejar el inicio de sesión
//   const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     try {
//       // Lógica de inicio de sesión con NextAuth.js
//       const response = await signIn('credentials', {
//         redirect: false,
//         ...credentials,
//       });

//       // Manejar la respuesta de la promesa signIn
//       if (response && response.error) {
//         console.error('Error al iniciar sesión:', response.error);
//         // Manejar el error de inicio de sesión aquí
//       } else {
//         // Si el inicio de sesión es exitoso, redirige al usuario
//         router.push('/dashboard'); // Ruta a la página después del inicio de sesión
//       }
//     } catch (error) {
//       console.error('Error al procesar el inicio de sesión:', error);
//     }
//   };

//   // Función para manejar cambios en los campos de formulario
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setCredentials({
//       ...credentials,
//       [e.target.id]: e.target.value,
//     });
//   };

//   return (
//     <div>
//       <h2 className="text-2xl font-semibold mb-4">Sign In</h2>

//       {/* Formulario de inicio de sesión */}
//       <form className="space-y-4" onSubmit={handleSignIn}>
//         {/* Email Input */}
//         <div>
//           <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
//             Email
//           </label>
//           <input
//             onChange={handleChange}
//             value={credentials.email}
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             id="email"
//             type="email"
//             placeholder="Email"
//             required
//           />
//         </div>

//         {/* Password Input */}
//         <div>
//           <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
//             Password
//           </label>
//           <input
//             onChange={handleChange}
//             value={credentials.password}
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             id="password"
//             type="password"
//             placeholder="Password"
//             required
//           />
//         </div>

//         {/* Botón de inicio de sesión */}
//         <button
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//           type="submit"
//         >
//           Sign In
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SignInPage;
