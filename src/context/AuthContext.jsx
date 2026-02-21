import { createContext, useState, useEffect, useCallback, useRef } from "react";
import keycloak from "../keycloak";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const isInitialized = useRef(false);

  const loadUserProfile = useCallback(() => {
    if (keycloak.tokenParsed) {
      const profile = {
        username: keycloak.tokenParsed.preferred_username,
        email: keycloak.tokenParsed.email,
        firstName: keycloak.tokenParsed.given_name,
        lastName: keycloak.tokenParsed.family_name,
        id: keycloak.tokenParsed.sub,
      };
      setUser(profile);
    }
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    keycloak.logout({
      redirectUri: import.meta.env.VITE_APP_URL || window.location.origin + "/",
    });
  }, []);

  useEffect(() => {
    if (isInitialized.current) {
      return;
    }

    isInitialized.current = true;

    keycloak
      .init({
        onLoad: "check-sso",
        redirectUri: (import.meta.env.VITE_APP_URL || window.location.origin) + "/",
        checkLoginIframe: false,
        pkceMethod: "S256",
        enableLogging: true,
      })
      .then((authenticated) => {
        setIsAuthenticated(authenticated);

        if (authenticated) {
          loadUserProfile();

          setInterval(() => {
            keycloak
              .updateToken(60)
              .then((refreshed) => {
                if (refreshed) {
                  loadUserProfile(); 
                }
              })
              .catch(() => {
                logout();
              });
          }, 60000);
        }

        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao inicializar Keycloak:", error);
        setIsLoading(false);
      });

    keycloak.onTokenExpired = () => {
      keycloak
        .updateToken(60)
        .then((refreshed) => {
          if (refreshed) {
            loadUserProfile();
          } else {
            console.log("Token não foi renovado, ainda válido");
          }
        })
        .catch(() => {
          logout();
        });
    };
  }, [loadUserProfile, logout]);

  const login = () => {
    keycloak.login({
      redirectUri: import.meta.env.VITE_APP_URL || window.location.origin + "/",
    });
  };

  const getToken = () => {
    return keycloak.token;
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    getToken,
    keycloak,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
