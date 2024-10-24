// import { useSupabaseStorage } from '../hooks/useSupabaseStorage';

// const SomeComponent = () => {
//   const { uploadFileAndSaveToDb, isLoading, error } = useSupabaseStorage('application');

//   const handleUpload = async (file: File) => {
//     const path = `uploads/${file.name}`;
//     const result = await uploadFileAndSaveToDb(file, path, {
//       user_profile_id: 'some-user-id',
//       business_id: 'some-business-id',
//       // Include other IDs as needed
//     });

//     if (result) {
//       console.log('File uploaded and saved to database:', result);
//     }
//   };

//   return (
//     <div>
//       {/* Your component JSX */}
//       {isLoading && <p>Loading...</p>}
//       {error && <p>Error: {error}</p>}
//     </div>
//   );
// };