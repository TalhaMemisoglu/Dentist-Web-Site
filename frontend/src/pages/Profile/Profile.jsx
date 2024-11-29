import React, { useState } from 'react';
import axios from 'axios';
import './Profile.scss';

const Profile = () => {
  const [activePage, setActivePage] = useState('account'); // State to manage active page

  // axiox.get() kullan fetch icin bu degerlere ata
  // it's a state for static profile details
  const [profileDetails, setProfileDetails] = useState(() => ({
    name: "John",
    surname: "Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890",
  }));
  
  const [originalDetails, setOriginalDetails] = useState({ ...profileDetails }); // state to store a copy of original state
  
  // Track if any field has been edited
  const [isEdited, setIsEdited] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Update profile details
    setProfileDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));

  // Check if any changes exist compared to the original state
  setIsEdited(Object.keys(profileDetails).some(
    (key) => profileDetails[key] !== originalDetails[key]
  ));

  // handle save changes
  const saveChanges = async () => {
    try {
      const response = await axios.put(`/api/profile/update`, profileDetails);
      console.log("Updated successfully:", response.data);
      setOriginalDetails(profileDetails); // Update the original state after saving
      setIsEdited(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(`Failed to update profile.`);
    }
  };
  

  // Cancel all changes
  const cancelChanges = () => {
    setProfileDetails({ ...originalDetails });
    setIsEdited(false); // Reset edit flag
  };

  const renderContent = () => {
    switch (activePage) {
      case 'account':
        return (
          <div className="container mt-5">
            <div className="card mt-4">
              <div className="card-body">
                {["name", "surname", "email", "phone"].map((field) => (
                  <div key={field} className="form-group">
                    <label className="form-label">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      type="text"
                      name={field}
                      value={profileDetails[field]}
                      onChange={handleInputChange}
                      className="form-control"
                      style={{
                        border: profileDetails[field] !== originalDetails[field]
                          ? "2px solid red"
                          : "1px solid #ced4da",
                      }}
                    />
                  </div>
                ))}

                {/* Global Save and Cancel Buttons */}
                <div className="d-flex justify-content-end mt-3">
                  <button
                    className="btn btn-success mr-2"
                    onClick={saveChanges}
                    disabled={!isEdited} // Disable Save if no edits
                    style={{
                      opacity: isEdited ? 1 : 0.5,
                      pointerEvents: isEdited ? "auto" : "none",
                    }}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={cancelChanges}
                    disabled={!isEdited} // Disable Cancel if no edits
                    style={{
                      opacity: isEdited ? 1 : 0.5,
                      pointerEvents: isEdited ? "auto" : "none",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'password':
        return (
          <div>
            <h4>Change Password</h4>
            <div className="card-body">
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input type="password" className="form-control" />
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input type="password" className="form-control" />
              </div>
              <div className="form-group">
                <label className="form-label">Repeat New Password</label>
                <input type="password" className="form-control" />
              </div>
            </div>
          </div>
        );
      case 'appointments':
        return (
          <div>
            <h4>Appointments</h4>
            <div className="card-body">
              <p>Here you can view and manage your appointments.</p>
              {/* Add appointment management UI here */}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // sutun ve geri kalan yapiyi olusturan main_view_maker
  return (
    <div className="container mt-5">
      <h4 className="font-weight-bold text-center">Profile Settings</h4>
      <div className="row mt-4">
        {/* Column layout */}
        <div className="col-md-4">
          <div
            className={`card text-center p-3 ${activePage === 'account' ? 'bg-primary text-white' : ''}`}
            onClick={() => setActivePage('account')}
            style={{ cursor: 'pointer' }}
          >
            <h5>Account</h5>
          </div>
        </div>
        <div className="col-md-4">
          <div
            className={`card text-center p-3 ${activePage === 'password' ? 'bg-primary text-white' : ''}`}
            onClick={() => setActivePage('password')}
            style={{ cursor: 'pointer' }}
          >
            <h5>Password</h5>
          </div>
        </div>
        <div className="col-md-4">
          <div
            className={`card text-center p-3 ${activePage === 'appointments' ? 'bg-primary text-white' : ''}`}
            onClick={() => setActivePage('appointments')}
            style={{ cursor: 'pointer' }}
          >
            <h5>Appointments</h5>
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="mt-4">
        <div className="card">
          <div className="card-body">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};
};
export default Profile;


 // <div>
          //   <h4>Account Settings</h4>
          //   <div className="card-body">
          //     <div className="form-group">
          //       <label className="form-label">Name</label>
          //       <input type="text" className="form-control mb-1" value= {profileDetails['name']} />
          //     </div>
          //     <div className="form-group">
          //       <label className="form-label">Surname</label>
          //       <input type="text" className="form-control" value= {profileDetails['surname']}/>
          //     </div>
          //     <div className="form-group">
          //       <label className="form-label">Email</label>
          //       <input type="text" className="form-control mb-1" value= {profileDetails['email']}/>
          //     </div>
          //     <div className="form-group">
          //       <label className="form-label">Phone Number</label>
          //       <input type="text" className="form-control mb-1" value= {profileDetails['phone']} />
          //     </div>
          //   </div>
          // </div>

//__________________________________________________________________________________________________________________________

// import React, { useState } from "react";
// import axios from "axios";

// const Profilee = () => {
  // // Profile state: current and original details
  // const [profileDetails, setProfileDetails] = useState({
  //   name: "John",
  //   surname: "Doe",
  //   email: "john.doe@example.com",
  //   phone: "123-456-7890",
  // });
  // const [originalDetails, setOriginalDetails] = useState({ ...profileDetails });

  // // Track if any field has been edited
  // const [isEdited, setIsEdited] = useState(false);

  // // Handle input changes
  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;

  //   // Update profile details
  //   setProfileDetails((prevDetails) => ({
  //     ...prevDetails,
  //     [name]: value,
//   //   }));

//     // Check if any changes exist compared to the original state
//     setIsEdited(Object.keys(profileDetails).some(
//       (key) => profileDetails[key] !== originalDetails[key]
//     ));
//   };

//   // Save all changes
//   const saveChanges = async () => {
//     try {
//       const response = await axios.put(`/api/profile/update`, profileDetails);
//       console.log("Profile updated successfully:", response.data);
//       alert("Profile updated successfully!");

//       // Update the original details to match the current state
//       setOriginalDetails({ ...profileDetails });

//       // Reset edit flag
//       setIsEdited(false);
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       alert("Failed to update profile.");
//     }
//   };

//   // Cancel all changes
//   const cancelChanges = () => {
//     setProfileDetails({ ...originalDetails });
//     setIsEdited(false); // Reset edit flag
//   };

//   // Render the form
//   return (
//     <div className="container mt-5">
//       <h4 className="font-weight-bold text-center">Profile Settings</h4>
//       <div className="card mt-4">
//         <div className="card-body">
//           {["name", "surname", "email", "phone"].map((field) => (
//             <div key={field} className="form-group">
//               <label className="form-label">
//                 {field.charAt(0).toUpperCase() + field.slice(1)}
//               </label>
//               <input
//                 type="text"
//                 name={field}
//                 value={profileDetails[field]}
//                 onChange={handleInputChange}
//                 className="form-control"
//                 style={{
//                   border: profileDetails[field] !== originalDetails[field]
//                     ? "2px solid red"
//                     : "1px solid #ced4da",
//                 }}
//               />
//             </div>
//           ))}

//           {/* Global Save and Cancel Buttons */}
//           <div className="d-flex justify-content-end mt-3">
//             <button
//               className="btn btn-success mr-2"
//               onClick={saveChanges}
//               disabled={!isEdited} // Disable Save if no edits
//               style={{
//                 opacity: isEdited ? 1 : 0.5,
//                 pointerEvents: isEdited ? "auto" : "none",
//               }}
//             >
//               Save
//             </button>
//             <button
//               className="btn btn-secondary"
//               onClick={cancelChanges}
//               disabled={!isEdited} // Disable Cancel if no edits
//               style={{
//                 opacity: isEdited ? 1 : 0.5,
//                 pointerEvents: isEdited ? "auto" : "none",
//               }}
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;


//__________________________________________________________________________________________________________________________

// function ProfilePage() {
    
//   return (
//     <div className="profile-page container">
//       <h2>Profile Information</h2>

//       {["name", "surname", "email", "phone"].map((field) => (
//         <div key={field} className="form-group profile-field">
//           <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
//           <div className="field-wrapper">
//             <input
//               type="text"
//               name={field}
//               value={profileDetails[field]}
//               onChange={handleInputChange}
//               disabled={editingField !== field}
//               className="form-control"
//             />
//             {editingField === field ? (
//               <>
//                 <button
//                   className="btn btn-success"
//                   onClick={() => saveChanges(field)}
//                 >
//                   Save
//                 </button>
//                 <button
//                   className="btn btn-secondary"
//                   onClick={() => cancelChanges(field)}
//                 >
//                   Cancel
//                 </button>
//               </>
//             ) : (
//               <button
//                 className="btn btn-primary"
//                 onClick={() => setEditingField(field)}
//               >
//                 Edit
//               </button>
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

