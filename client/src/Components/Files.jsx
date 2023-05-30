import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Modal from "./Modal";

export default function Files({ groupId }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredFile, setHoveredFile] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [newFile, setNewFile] = useState();
  const token = useSelector((state) => state.user.token);

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const makeDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    const normalDate = date.toLocaleString("en-GB", options); // Adjust the locale as per your requirement
    return normalDate;
  };

  const getSize = (size) => {
    if (!size) return null;
    if (size < 1024) {
      return size + " bytes";
    } else if (size < 1024 * 1024) {
      return (size / 1024).toFixed(2) + " KB";
    } else {
      return (size / (1024 * 1024)).toFixed(2) + " MB";
    }
  };

  const downloadClick = async (filename, name) => {
    try {
      const response = await axios.get(`/file/download/${filename}`, {
        headers: { authorization: `Bearer ${token}`, responseType: "blob" },
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));

      const downloadFilename = name || "file.ext";

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", downloadFilename);
      document.body.appendChild(link);
      link.click();

      // Clean up the URL object and the link element
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteClick = async (filename) => {
    const response = await axios.post(
      "/file/delete",
      {
        filename,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setFiles(
      files.filter((file) => {
        if (file.filename === filename) return false;
        return true;
      })
    );
  };

  const newFileRequest = async () => {
    try {
      setIsOpen(false);

      const formData = new FormData();
      console.log(groupId);
      console.log(newFile);
      formData.append("groupId", groupId);
      formData.append("name", newFile.name);
      formData.append("file", newFile);
      const response = await axios.post("/file/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
      });
      setFiles(response.data.files);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.post(
        "/file/get",
        { groupId },
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );
      setFiles(response.data.files);
      setLoading(false);
    };

    fetchData();
  }, [groupId]);

  useEffect(() => {
    console.log(files);
  }, [files]);

  return (
    <div className="h-screen bg-white">
      {loading ? (
        <h1>LOADING...</h1>
      ) : (
        <div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    className="text-xs text-white px-2 py-1 rounded-md bg-green-500 hover:bg-green-600 absolute top-0 right-0 mt-2 mr-5"
                    onClick={openModal}
                  >
                    New File
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {files.map((el) => (
                <tr
                  key={el.filename}
                  className="hover:bg-slate-100"
                  onMouseEnter={() => setHoveredFile(el)}
                  onMouseLeave={() => setHoveredFile("")}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {el.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {getSize(el.size) || "..."}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {makeDate(el.timestamp) || "..."}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right relative flex items-center">
                    <div className="flex justify-end">
                      {hoveredFile === el && (
                        <div className="absolute right-5">
                          <div className="flex items-center">
                            <button
                              className="text-xs text-gray-800 px-2 py-1 rounded-md bg-gray-300 hover:bg-gray-400"
                              onClick={() =>
                                downloadClick(el.filename, el.name)
                              }
                            >
                              Download
                            </button>
                            <button
                              className="text-xs text-white px-2 py-1 rounded-md bg-red-500 hover:bg-red-600 ml-2"
                              onClick={() => deleteClick(el.filename)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Modal isOpen={isOpen} onClose={closeModal}>
            <div className="p-4 flex flex-wrap justify-center bg-gray-50 dark:bg-gray-800 text-black dark:text-white">
              <h2 className="text-3xl mt-4">Upload file</h2>

              <input
                className="mt-5 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                type="file"
                onChange={(e) => {
                  setNewFile(e.target.files[0]);
                }}
              />

              <button
                className="bg-blue-500 w-full mt-5 h-10 rounded-lg hover:bg-blue-600"
                onClick={newFileRequest}
              >
                Upload
              </button>
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
}
