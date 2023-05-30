import {
  DocumentIcon,
  UserIcon,
  MoonIcon,
  SunIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { changeMode, setToken } from "../storage/userSlice";
import { useEffect, useState } from "react";
import Modal from "../Components/Modal";
import Input from "../Components/Input";
import axios from "axios";
import Files from "../Components/Files";

export default function Home() {
  const mode = useSelector((state) => state.user.darkMode);
  const [darkMode, setDarkMode] = useState(mode);
  const [isOpen, setIsOpen] = useState(false);
  const [newGroupIsOpen, setNewGroupIsOpen] = useState(false);
  const [newGroupText, setNewGroupText] = useState("");
  const [groups, setGroups] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {group} = useParams();
  const token = useSelector((state) => state.user.token);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const openNewGroupModal = () => {
    setNewGroupIsOpen(true);
  };

  const closeNewGroupModal = () => {
    setNewGroupIsOpen(false);
  };

  const createNewGroup = async () => {
    if (newGroupText) {
      const response = await axios.post(
        "/group/new",
        { groupName: newGroupText },
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );
      const data = response.data;
      console.log(data)
      setGroups([...groups, data]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("/group/user", {
        headers: { authorization: `Bearer ${token}` },
      });
      const data = response.data;
      console.log(data);
      setGroups(data);
    };

    fetchData();
  }, []);

  useEffect(() => {console.log(groups)}, [groups])



  return (
    <div className={darkMode ? "dark" : "light"}>
      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4  bg-gray-300 dark:bg-gray-800">
          <Link to="/home" className="flex items-center pl-2.5 mb-5 ">
            <DocumentIcon className="h-6 w-6 dark:text-white mr-3" />

            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white ">
              FILES
            </span>
          </Link>

          <div className="flex flex-col h-full border-t border-gray-200 dark:border-gray-700">
            <ul className="space-y-2 font-medium flex-grow my-2 ">
              <li className="mb-2 cursor-pointer" onClick={openNewGroupModal}>
                <p className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                  <PlusCircleIcon className="h-6 w-6 " />
                  <span className="ml-3">New group</span>
                </p>
              </li>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                {groups.map((el) => (
                  <li key={el._id}>
                    <Link
                      to={`/home/${el._id}`}
                      className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <span className="ml-3">{el.name}</span>
                    </Link>
                  </li>
                ))}
              </div>
            </ul>
            <ul className="pt-4 space-y-2 mt-auto mb-12 font-medium border-t border-gray-200 dark:border-gray-700">
              <li className="cursor-pointer">
                <p
                  onClick={() => {
                    dispatch(changeMode());
                    setDarkMode(!darkMode);
                  }}
                  className="flex items-center p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group"
                >
                  {darkMode ? (
                    <MoonIcon className="h-6 w-6" />
                  ) : (
                    <SunIcon className="h-6 w-6 " />
                  )}

                  <span className="ml-3">
                    Switch to {darkMode ? "light" : "dark"} mode
                  </span>
                </p>
              </li>
              <li className="cursor-pointer">
                <p
                  onClick={openModal}
                  className="flex items-center p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group"
                >
                  <UserIcon className="h-6 w-6 " />

                  <span className="ml-3">Account</span>
                </p>
              </li>
            </ul>
          </div>
        </div>
      </aside>

      <div className="sm:ml-64 bg-slate-200 h-screen">
        {!group ? (
          <div className="flex justify-center items-center h-full">
            <h1 className="text-4xl">← Select group first</h1>
          </div>
        ) : (
          <Files groupId={group}/>
        )}
      </div>

      {/* USER MODAL */}
      <Modal isOpen={isOpen} onClose={closeModal}>
        <div className="p-4 flex flex-wrap justify-center bg-gray-50 dark:bg-gray-800 text-black dark:text-white">
          <h2 className="text-3xl mt-4">Your account</h2>
          <button className="bg-gray-400 w-full mt-6 h-10 rounded-lg hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-700">
            Change usernmae
          </button>
          {/*DOESNT WORK 🥰 */}

          <button
            className="bg-red-500 w-full mt-2 h-10 rounded-lg hover:bg-red-600"
            onClick={() => {
              dispatch(setToken(""));
              navigate("/");
            }}
          >
            Log out
          </button>
        </div>
      </Modal>

      {/* NEW GROUP MODAL */}
      <Modal isOpen={newGroupIsOpen} onClose={closeNewGroupModal}>
        <div className="p-4 flex flex-wrap justify-center bg-gray-50 dark:bg-gray-800 text-black dark:text-white">
          <h2 className="text-3xl mt-4">New group</h2>
          <Input
            text="Group name"
            className="mt-4"
            value={newGroupText}
            onChange={(e) => setNewGroupText(e.target.value)}
          />
          <button
            className="bg-blue-500 w-full mt-5 h-10 rounded-lg hover:bg-blue-600"
            onClick={() => {createNewGroup(); setNewGroupIsOpen(false)}}
          >
            Create group
          </button>
        </div>
      </Modal>
    </div>
  );
}
