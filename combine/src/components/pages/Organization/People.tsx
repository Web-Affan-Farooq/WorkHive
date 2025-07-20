"use client"
import { ManagementSidebar } from '@/components/layout';
import Link from "next/link";
import { Modal, Box, Typography } from '@mui/material';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import { useEffect, useState } from 'react';
import { Employee } from '@/@types/Worker';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const Card = ({ employeeData }: { employeeData: any }) => {
    return (
        <div className="flex items-center gap-4 md:px-[30px] py-2 w-full">
            {/* Profile Image */}
            <div className="flex-shrink-0">
                <div className="rounded-lg border-2 border-gray-500 w-[45px] h-[45px] overflow-hidden">
                    <img
                        src="https://cdn.dribbble.com/userupload/13475147/file/original-0b9c0607f2db3125f46f25014391394d.png?resize=1024x640&vertical=center"
                        alt={employeeData.name}
                        width={90}
                        height={90}
                        className="object-cover w-full h-full"
                    />
                </div>
            </div>

            {/* Profile Info */}
            <div className="flex flex-col justify-center items-start min-w-0">
                {/* <div className="relative flex flex-row flex-nowrap justify-center items-center gap-[10px]">
                <h4 className="text-white text-md font-bold leading-tight truncate">Mdfu ifuiods ff dsfidsopfi ad Affan</h4>
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                </div> */}
                <div className="relative flex flex-row flex-nowrap justify-center items-center gap-[10px] min-w-0 w-full">
                    <h4 className="text-[15px] font-bold leading-tight flex-grow">
                        {employeeData.name}
                    </h4>
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                </div>

                <p className="text-sm text-pink-text break-words">{employeeData.email}</p>
            </div>

        </div>
    );
};

const style = {
    position: 'absolute',
    top: '50%',
    left: '60%',
    transform: 'translate(-50%, -50%)',
    width: "auto",
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const Peoples = () => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const [employees, setemployees] = useState<Employee[]>([]);
    const [id, setId] = useState("");

useEffect(() => {
    const getData = async () => {
        const employeesFetched = await axios.get("/api/employees");
        setemployees(employeesFetched.data.employees);
    };

    getData();

    if (typeof window !== "undefined") {
        const orgId = window.localStorage.getItem("ID");
        console.log("id:", orgId);

        if (!orgId) {
            router.push("/login-org");
        } else {
            setId(orgId);
        }
    }
}, []);

    return (
        <main className="flex h-screen bg-white">
            <ManagementSidebar />
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className="border-none w-[80vw]"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Invite people
                    </Typography>
                    <div className='p-[5px]'>
                        <div className='flex flex-row gap-[10px] items-center'>
                            <div className='bg-gray-800/90 text-gray-400 px-[15px] py-[5px] rounded-md truncate w-[200px]'>
                                {id}
                            </div>
                            <button type="button" className='bg-gray-400 px-[10px] py-[1px] rounded-md' onClick={(e) => {
                                window.navigator.clipboard.writeText(id)
                                e.currentTarget.innerText = "Copied"
                            }}>copy</button>
                        </div>
                    </div>
                    <div className='mt-2 flex flex-row flex-nowrap justify-center items-start gap-[10px]'>
                        <CheckCircleOutlineIcon className='text-green-500'/>
                        <span className='text-gray-500 text-sm'>Send this id to the employees, this will be required for login</span>
                    </div>
                    
                </Box>
            </Modal>

            <section className="flex-1 h-screen overflow-y-auto p-10 max-sm:px-5 max-sm:py-7">
                <div className="flex flex-row flex-nowrap justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">People</h1>
                    <button onClick={() => { setOpen(!open) }} type="button" className="bg-gray-900 cursor-pointer px-[10px] text-sm py-[5px] rounded-md text-white flex flex-row flex-nowrap justify-start items-center gap-[3px]">
                        <AddSharpIcon className="size-sm" />
                        <span>Invite</span>
                    </button>
                </div>
                <div>
                    {
                        employees.length <= 0 ? <p className='text-gray-400'>No People for this organization found ...</p> : employees.map((employee, idx) => (
                            <Link href={`/management/people/${employee.id}`} key={idx}>
                                <Card employeeData={employee} />
                            </Link>
                        ))
                    }
                </div>
            </section>
        </main>
    );
};

export default Peoples;