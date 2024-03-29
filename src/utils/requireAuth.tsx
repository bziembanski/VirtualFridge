import { NavLink, Navigate, useLocation, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { deleteDoc, doc, getFirestore } from "firebase/firestore";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";

import Button from "../components/Button";
import Drawer from "../components/Drawer";
import { Outlet } from "react-router-dom";
import firestoreApp from "../firestoreApp";
import { getAuth } from "firebase/auth";
import { useTitleContext } from "../contexts/TitleContext";

const auth = getAuth(firestoreApp);

const RequireAuth: React.FC = () => {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const [signOut] = useSignOut(auth);
  const [isOpen, setIsOpen] = useState(false);
  const [title] = useTitleContext();
  const location = useLocation();

  const boardId = location.pathname.startsWith("/fridge")
    ? location.pathname.split("/")[2]
    : undefined;

  if (loading) {
    return <div>Loading</div>;
  }
  if (!user) {
    return <Navigate to="/login" />;
  }
  return (
    <div className="w-full h-full relative flex flex-col">
      <div className="w-full justify-end flex items-center gap-5 p-5">
        <button
          className="material-icons text-3xl md:text-4xl mr-auto text-blue-dark"
          onClick={() => navigate("/")}
        >
          arrow_back
        </button>
        <span className="text-blue-dark font-bold text-xl md:text-3xl">
          {title ?? user.displayName ?? user.email}
        </span>
        <button
          className="h-[1em] text-md md:text-lg"
          onClick={() => setIsOpen(true)}
        >
          <span className="material-icons text-blue-dark">menu</span>
        </button>
      </div>
      <Drawer isOpen={isOpen} setIsOpen={setIsOpen}>
        <Button
          onClick={async () => {
            await signOut();
            setIsOpen(false);
          }}
        >
          Sign Out
        </Button>
        {boardId && (
          <>
            <NavLink
              to={`edit/${boardId}`}
              onClick={() => setIsOpen(false)}
              className="w-full"
            >
              <Button className="w-full">Edit fridge</Button>
            </NavLink>

            <Button
              className="w-full"
              onClick={() => {
                deleteDoc(doc(getFirestore(firestoreApp), "boards", boardId));
                setIsOpen(false);
                navigate(`/`);
              }}
            >
              Delete fridge
            </Button>
          </>
        )}
      </Drawer>
      <Outlet />
    </div>
  );
};

export default RequireAuth;
