/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import {
  handleSelectProps,
  IDataTableProps,
  profilesEnum,
  statusGeneralEnum,
  UserDto,
} from "@/types";
import {
  blockUser,
  changeRole,
  getAllUsers,
  unblockUser,
} from "@/helpers/services";
import { useAuth } from "@/context/AuthProvider";
import { Badge } from "../Badges";
import { formatDate } from "@/helpers/formatDate";
import Dropdown from "../Dropdown";
import Loader from "../Loader";
import { useProfile } from "@/context/ProfileProvider";

const DataTable: React.FC<IDataTableProps> = ({
  usersFiltered,
  columns,
  state,
  profiles,
  trigger,
  setTrigger,
  onUserClick
}) => {
  const { token } = useAuth();
  const { userDtos } = useProfile();
  const [users, setUsers] = useState<UserDto[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserDto[]>([]);
  const [openModalUserId, setOpenModalUserId] = useState<string | null>(null);
  const [openRoleModalUserId, setOpenRoleModalUserId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [statusLoading, setStatusLoading] = useState<string | null>(null);
  const [roleChange, setRoleChange] = useState<{
    userId: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    getAllUsers(token)
      .then((res) => setUsers(res))
      .catch(Error) 
      .finally(() => setLoading(false));
  }, [token, trigger]);

  useEffect(() => {
    let filtered = users;

    if (profiles?.name) {
      switch (profiles.name) {
        case "Administrador":
          filtered = filtered.filter((u) => u.role === profilesEnum.admin);
          break;
        case "Vendedor":
          filtered = filtered.filter((u) => u.role === profilesEnum.seller);
          break;
        case "Usuario":
          filtered = filtered.filter((u) => u.role === profilesEnum.user);
          break;
        default:
          break;
      }
    }

    if (state?.name) {
      switch (state.name) {
        case "Activo":
          filtered = filtered.filter(
            (u) => u.statusGeneral === statusGeneralEnum.active
          );
          break;
        case "Inactivo":
          filtered = filtered.filter(
            (u) => u.statusGeneral === statusGeneralEnum.inactive
          );
          break;
        case "Bloqueado":
          filtered = filtered.filter(
            (u) => u.statusGeneral === statusGeneralEnum.blocked
          );
          break;
        default:
          break;
      }
    }

    setFilteredUsers(filtered);
  }, [state?.name, profiles?.name, users, trigger]);

  const statusLoadingHandler = (userId: string) => {
    setStatusLoading(userId);
  };

  const openModalHandler = (userId: string) => {
    setOpenModalUserId(userId);
  };
  const openRoleModalHandler = (userId: string, role: string) => {
    setOpenRoleModalUserId(userId);
    setRoleChange({ userId, role });
  };

  const closeModalHandler = () => {
    setOpenModalUserId(null);
    setOpenRoleModalUserId(null);
    setRoleChange(null);
  };

  const blockHandler = async (user: UserDto) => {
    try {
      let updatedUser;
      statusLoadingHandler(user.id);
      setLoading(true);
      setOpenModalUserId(null);
      if (user.statusGeneral !== statusGeneralEnum.blocked) {
        await blockUser(token, user.id);
        updatedUser = { ...user, statusGeneral: statusGeneralEnum.blocked };
      } else {
        await unblockUser(token, user.id);
        updatedUser = { ...user, statusGeneral: statusGeneralEnum.active };
      }

      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === user.id ? updatedUser : u))
      );
      setTrigger(!trigger);
    } catch (error) {
    } finally {
      setLoading(false);
      setStatusLoading(null);
    }
  };

  const handleSelect = async ({ id, role }: handleSelectProps) => {
    await changeRole(id, role, token);
    setTrigger(!trigger);
  };

  const handleRoleChangeConfirm = async () => {
    if (roleChange) {
      await handleSelect({ id: roleChange.userId, role: roleChange.role });
      closeModalHandler();
    }
  };

  const combinedFilteredUsers =
    usersFiltered?.filter((user) =>
      filteredUsers.some((filteredUser) => filteredUser.id === user.id)
    ) || filteredUsers;

  const uniqueUsers = combinedFilteredUsers.reduce((acc, user) => {
    if (!acc.some((u) => u.id === user.id)) {
      acc.push(user);
    }
    return acc;
  }, [] as UserDto[]);

  return (
    <table className="w-full mb-20 text-sm text-left rtl:text-right bg-[#f1fafa]">
      <thead className="text-sm text-primary-darker uppercase bg-[#f1fafa] border-b-primary-default border">
        <tr>
          <th scope="col" className="p-4"></th>
          {columns?.map((column) => {
            return (
              <th key={column.label} scope="col" className="px-6 py-3">
                {column.label}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody className="text-[#667085]">
        {uniqueUsers.map((user) => (
          <tr key={user.id} className="shadow-sm">
            <th
              scope="row"
              className="px-6 py-4 font-medium whitespace-nowrap"
            ></th>
            <td className="px-6 py-4">{user.seller?.sku || "-"}</td>
            <td className="px-6 py-4">
              {user.role === profilesEnum.admin ? (
                <p className="text-primary-dark">{user.role}</p>
              ) : (
                <Dropdown
                  options={[
                    { id: "1", name: "seller" },
                    { id: "2", name: "user" },
                  ]}
                  value={user.role}
                  onSelect={(selectedOption) =>
                    openRoleModalHandler(user.id, selectedOption.name)
                  }
                  className="w-20 "
                  bg="bg-[#F9FAFB]"
                  noId={true}
                />
              )}
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <img
                  src={user.profile_picture}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex flex-col">
                  <p onClick={() => onUserClick(user)} className="cursor-pointer text-[#667085] hover:text-primary-dark">{user.email}</p>
                  <p onClick={() => onUserClick(user)} className="cursor-pointer text-[#667085] hover:text-primary-dark">{`${user.name} ${user.lastname} `}</p>
                </div>
              </div>
            </td>
            <td className="px-6 py-4">
              {user.registration_date ? formatDate(user.registration_date) : ""}
            </td>
            <td className="px-6 py-4">
              {loading && statusLoading === user.id ? (
                <Loader />
              ) : (
                <Badge type={user?.statusGeneral} />
              )}
            </td>
            <td className="">
              <div className="flex items-center justify-center">
                {user.role === profilesEnum.admin &&
                user.statusGeneral !== statusGeneralEnum.blocked ? (
                  userDtos?.id !== user.id && (
                    <button
                      onClick={() => openRoleModalHandler(user.id, "user")}
                      title="Bloquear"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="2.5em"
                        height="2.5em"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="#2F8083"
                          d="M18.042 15.473L7.377 4.796L12 3.077l7 2.615V11.1q0 1.025-.22 2.102t-.738 2.271m1.758 5.743l-3.288-3.289q-.893 1.071-2.065 1.868T12 20.961q-3.148-.932-5.074-3.727T5 11.1V6.416L2.862 4.277l.707-.708l16.939 16.939z"
                        />
                      </svg>
                    </button>
                  )
                ) : (
                  <>
                    <button
                      onClick={() => {
                        openModalHandler(user.id);
                      }}
                      className="font-medium  text-primary-darker cursor-pointer"
                      title={user.statusGeneral === statusGeneralEnum.blocked ? "Desbloquear" : "Bloquear"}
                    >
                      {user.statusGeneral === statusGeneralEnum.blocked ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="2.5em"
                          height="2.5em"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="#2F8083"
                            fillRule="evenodd"
                            d="M5.636 18.364A9 9 0 1 0 18.364 5.636A9 9 0 0 0 5.636 18.364m2.171-.757a7.001 7.001 0 0 0 9.8-9.8l-2.779 2.779a1 1 0 0 1-1.414-1.414l2.778-2.779a7.002 7.002 0 0 0-9.799 9.8l2.779-2.779a1 1 0 0 1 1.414 1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="2.5em"
                          height="2.5em"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="#2F8083"
                            d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10s10-4.486 10-10S17.514 2 12 2M4 12c0-1.846.634-3.542 1.688-4.897l11.209 11.209A7.946 7.946 0 0 1 12 20c-4.411 0-8-3.589-8-8m14.312 4.897L7.103 5.688A7.948 7.948 0 0 1 12 4c4.411 0 8 3.589 8 8a7.954 7.954 0 0 1-1.688 4.897"
                          />
                        </svg>
                      )}
                    </button>

                    {user.statusGeneral !== statusGeneralEnum.blocked && (
                      <button
                        onClick={() => openRoleModalHandler(user.id, "admin")}
                        title="Convertir a admin"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="2.5em"
                          height="2.5em"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="#2F8083"
                            d="M16.616 17.385v1.73q0 .154.115.27q.115.115.269.115t.27-.115t.114-.27v-1.73h1.731q.154 0 .27-.116q.115-.115.115-.269t-.115-.27t-.27-.114h-1.73v-1.731q0-.154-.116-.27q-.115-.115-.269-.115t-.27.116q-.114.115-.114.269v1.73h-1.731q-.154 0-.27.116q-.115.115-.115.269t.116.27q.115.114.269.114zM17 21q-1.671 0-2.835-1.164Q13 18.67 13 17t1.165-2.835T17 13t2.836 1.165T21 17t-1.164 2.836T17 21M5 11.104V6.817q0-.514.293-.926q.292-.412.757-.597l5.385-2q.292-.106.565-.106t.566.106l5.384 2q.464.186.757.597q.293.412.293.926v3.57q0 .356-.279.576t-.646.153q-.258-.068-.534-.092Q17.264 11 17 11q-2.496 0-4.248 1.752T11 17q0 .627.14 1.274q.139.647.45 1.326q.187.398-.108.716t-.693.15q-1.147-.512-2.08-1.293q-.932-.78-1.703-1.865q-.948-1.322-1.477-2.902Q5 12.827 5 11.104"
                          />
                        </svg>
                      </button>
                    )}
                    {openRoleModalUserId && roleChange && (
                      <div
                        className="fixed z-20 inset-0 flex items-center justify-center   bg-black bg-opacity-10"
                        onClick={() => closeModalHandler()}
                      >
                        <div
                          className="bg-primary-lighter h-[40vh] w-[50vw] p-8 m-3 md:m-0 rounded-3xl relative flex items-center justify-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            className="absolute top-2 right-2 text-2xl font-bold text-primary-darker rounded-full"
                            onClick={() => closeModalHandler()}
                          >
                            ✖
                          </button>
                          <div className="flex flex-col gap-4 justify-center items-center">
                            {
                              <p className="font-bold text-3xl flex items-center justify-center text-center text-primary-darker">
                                {`¿Estás seguro de asignar el rol ${roleChange?.role}`}
                              </p>
                            }
                            <div className="gap-4 flex">
                              <button
                                onClick={() => closeModalHandler()}
                                className="bg-white text-primary-darker px-4 py-3 rounded-lg border border-[#D0D5DD]"
                              >
                                No
                              </button>
                              <button
                                onClick={handleRoleChangeConfirm}
                                className="bg-primary-darker text-white px-4 py-3 rounded-lg border border-[#D0D5DD]"
                              >
                                Si
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {openModalUserId === user.id && !roleChange && (
                      <div
                        className="fixed z-20 inset-0 flex items-center justify-center bg-black bg-opacity-50"
                        onClick={() => closeModalHandler()}
                      >
                        <div
                          className="bg-primary-lighter h-[40vh] w-[50vw] p-8 m-3 md:m-0 rounded-3xl relative flex items-center justify-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            className="absolute top-2 right-2 text-2xl font-bold text-primary-darker rounded-full"
                            onClick={() => closeModalHandler()}
                          >
                            ✖
                          </button>
                          <div className="flex flex-col gap-4 justify-center items-center">
                            <p className="font-bold text-3xl flex items-center justify-center text-center text-primary-darker">
                              ¿Estás seguro de{" "}
                              {user.statusGeneral === statusGeneralEnum.blocked
                                ? "desbloquear "
                                : "bloquear "}
                              este usuario?
                            </p>
                            <div className="gap-4 flex">
                              <button
                                onClick={() => closeModalHandler()}
                                className="bg-white text-primary-darker p-2 rounded-lg border border-[#D0D5DD]"
                              >
                                Cancelar
                              </button>
                              <button
                                onClick={() => blockHandler(user)}
                                className="bg-primary-darker text-white p-2 rounded-lg border border-[#D0D5DD]"
                              >
                                {user.statusGeneral ===
                                statusGeneralEnum.blocked
                                  ? "Desbloquear"
                                  : "Bloquear"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {openRoleModalUserId && roleChange && (
                      <div
                        className="fixed z-20 inset-0 flex items-center justify-center"
                        onClick={() => closeModalHandler()}
                      >
                        <div
                          className="bg-primary-lighter h-[40vh] w-[50vw] p-8 m-3 md:m-0 rounded-3xl relative flex items-center justify-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            className="absolute top-2 right-2 text-2xl font-bold text-primary-darker rounded-full"
                            onClick={() => closeModalHandler()}
                          >
                            ✖
                          </button>
                          <div className="flex flex-col gap-4 justify-center items-center">
                            {
                              <p className="font-bold text-3xl flex items-center justify-center text-center text-primary-darker">
                                {`¿Estás seguro de asignar el rol ${roleChange?.role}?`}
                              </p>
                            }
                            <div className="gap-4 flex">
                              <button
                                onClick={() => closeModalHandler()}
                                className="bg-white text-primary-darker px-4 py-3 rounded-lg border border-[#D0D5DD]"
                              >
                                No
                              </button>
                              <button
                                onClick={handleRoleChangeConfirm}
                                className="bg-primary-darker text-white px-4 py-3 rounded-lg border border-[#D0D5DD]"
                              >
                                Si
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
