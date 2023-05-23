var ARButton = {
    createButton: function(gl, options) {
        if (options && options.referenceSpaceType) {
            gl.xr.setReferenceSpaceType(options.referenceSpaceType);
        }

        function EnterVR() {
            button.innerHTML = 'Enter XR';
            var currentSession = null;
        
            function onSessionStarted(session) {
                session.addEventListener('end', onSessionEnded);
                gl.xr.setSession(session);
                button.textContent = 'Exit XR';
                currentSession = session;
            }

            function onSessionEnded() {
                currentSession.removeEventListener('end',
                onSessionEnded);
                button.textContent = 'Enter XR';
                currentSession = null;
            }

            button.onclick = () => {
                console.log('Button pressed');
                if (currentSession === null) {
                    let sessionInit = {
                            optionalFeatures: ["local-floor", "bounded-floor"]
                        };
                    navigator.xr.requestSession('immersive-ar', sessionInit).then(onSessionStarted);
                }
                else {
                    currentSession.end();
                }

            }
        
        }
        
        function NotFound() {
            button.textContent = 'immersive-ar not supported';
            console.log('immersive-ar mode not found');
        }

        if (navigator.xr) {
            var button = document.createElement("button");
            navigator.xr.isSessionSupported('immersive-ar').then(function(supported) {
                if (supported) { 
                    EnterVR() 
                }
                else { 
                    NotFound();
                }
            });
            button.setAttribute("id", "btn");
            return button;
        } else {
            if (window.isSecureContext === false) {
                console.log('WebXR needs HTTPS');
            } else {
                console.log('WebXR not available');
            }
            return;
        }
    }
}

export {ARButton};



