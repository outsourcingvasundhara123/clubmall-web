import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const DeleteAccount = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);

  const validateEmail = (email) => {
    return email.match(
      // A simple regex for demonstration; for production use more robust validation
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setIsValidEmail(true);
  };

  const handleDeleteAccount = (event) => {
    event.preventDefault();
    if (validateEmail(email)) {
      setIsSubmitted(true);
      // Further processing here like sending data to server
    } else {
      setIsValidEmail(false);
    }
  };

  return (
    <section>
      <div className="section-after">
      <div className='container'>
        <div className="my-5 py-5 row justify-content-center">
        <div  className='col-8'>
          <div className="card shadow-lg rounded-3 border-0">
            <div className="border-bottom p-3">
              <h3 className="text-center">Account Deletion</h3>
            </div>
            {!isSubmitted ? (
              <div className="card-body" id="CardBody">
                <p className="card-text text-muted fw-semibold w-100">
                We appreciate your engagement with Clubmall and are sorry to hear that you're considering deleting your account. Please note that if you choose to delete your account, the process will take approximately 24 working hours to complete. During this period, your account information will be securely processed and removed from our systems. After the deletion is complete, you are welcome to recreate your account and rejoin the Clubmall community at any time. We value your presence and hope you reconsider, but if you decide to proceed with the account deletion, we wish you the best and hope to welcome you back in the future.
                  {/* shortened for brevity */}
                </p>
                <form className="row g-3 needs-validation" noValidate>
                  <div className="col-md-12 pt-3">
                    <input 
                      type="email" 
                      className={`form-control ${!isValidEmail ? 'is-invalid' : ''}`} 
                      id="validationCustom03"
                      placeholder="Enter your email" 
                      required
                      value={email}
                      onChange={handleEmailChange}
                    />
                    <div className="invalid-feedback">
                      Please provide a valid email.
                    </div>
                  </div>
                  <p className="card-text text-danger fw-bolder w-100">
                    <i className="fa-solid fa-triangle-exclamation fs-5 pe-2"></i>
                    Note* : The process will take approximately 24 working hours to complete.
                  </p>
                  <div className="col-12 d-flex justify-content-end ">
                    <button 
                      className="btn btn-danger" 
                      type="submit"
                      onClick={handleDeleteAccount}
                    >
                      Delete My Account
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div id="Success">
                <div className="success-checkmark">
                  <div className="check-icon">
                    <span className="icon-line line-tip"></span>
                    <span className="icon-line line-long"></span>
                    <div className="icon-circle"></div>
                    <div className="icon-fix"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
      </div>
    </section>
  );
};

export default DeleteAccount;
