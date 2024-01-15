import { useContext } from "react";
import { FBContext } from "../context/FBContextProvider";

export const useFBContextProvider = () => useContext(FBContext);
