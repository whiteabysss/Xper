import React from 'react';
import { Link, useHistory } from 'react-router-dom';

import firebase from '../components/firebase';

import Swal from 'sweetalert2';

import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import LanguageIcon from '@material-ui/icons/Language';
import LaunchIcon from '@material-ui/icons/Launch';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
    header: {
        position: 'absolute',
        height: '50px',
        width: '100%',
        margin: 'auto',
        top: 0,
        right: 0,
        left: 0,
        backgroundColor: '#50C0FF'
    },
    brandingName: {
        position: 'absolute',
        fontFamily: "'Orbitron', sans-serif",
        height: "fit-content",
        width: "fit-content",
        fontSize: '25px',
        fontWeight: '600',
        color: '#1A202E',
        margin: 'auto',
        top: '0',
        left: '15px',
        bottom: '0'
    },
    fabBtn: {
        position: 'absolute',
        color: '#1A202E',
        backgroundColor: '#50C0FF !important',
        margin: 'auto',
        right: '15px',
        bottom: '15px'
    },
    photoURL: {
        height: '50px',
        width: '50px',
        position: 'absolute',
        margin: 'auto',
        top: '0',
        right: '5px',
        bottom: '0'
    },
    menu: {
        color: '#50C0FF',
        fontFamily: "'Comfortaa', sans-serif",
    },
    projectsContainer: {
        position: 'absolute',
        height: 'calc(100% - 50px)',
        width: '100%',
        margin: 'auto',
        right: 0,
        left: 0,
        top: '50px',
        overflowX: 'hidden',
        overflowY: 'auto'
    },
    projectsGrid: {
        padding: '15px',
        height: 'fit-content',
        width: '100%',
        display: 'grid',
        gridGap: '15px',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))'
    },
    root: {
        position: 'relative',
        height: "fit-content",
        width: "100%",
        backgroundColor: "#1A202E",
    },
    title: {
        fontSize: 30,
        fontFamily: "'Comfortaa', sans-serif",
        color: "#50C0FF",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
    },
    pos: {
        fontSize: 17,
        color: "#fff",
        fontFamily: "'Comfortaa', sans-serif",
    },
    deleteBtn: {
        color: "#FF6D6D"
    },
    openBtn: {
        color: "#50C0FF"
    },
    noProjects: {
        height: "fit-content",
        width: "fit-content",
        position: "absolute",
        margin: "auto",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        fontFamily: "'Comfortaa', sans-serif",
        fontSize: '34px',
        textAlign: "center",
        color: '#1A202E',
        display: "none"
    }
}));
function Projectspage() {
    document.title = "Projects - Xper"
    const classes = useStyles();
    let history = useHistory();

    let firebaseRef = React.useRef();
    let myUID = React.useRef();

    const [displayName, setDisplayName] = React.useState("");
    const [userPhoto, setUserPhoto] = React.useState("");

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const [open, setOpen] = React.useState(false);
    const startBackdrop = (instruct) => {
        setOpen(instruct);
    };

    const [projects, setProjects] = React.useState([]);

    const noProjects = React.useRef();

    const makeNewProject = (e) => {
        startBackdrop(true);
        const date = new Date();
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const created = date.getDate() + " " + months[date.getMonth()] + ", " + date.getFullYear();
        if (firebase.auth) {
            firebaseRef.current.push({
                name: "Untitled",
                html: `<!DOCTYPE html>
<html>
    <head>
        <title>Document Title</title> 
    </head>
    <body>
        <h1>HTML goes here</h1>
    </body>
</html>`,
                css: `body{
                
}`,
                js: `//JavaScript goes here`,
                created: created
            })
                .then(snap => {
                    history.push("/edit/" + myUID.current + "/" + snap.key);
                })
        }
    }

    React.useEffect(() => {
        startBackdrop(true);
        firebase.auth().onAuthStateChanged(firebaseUser => {
            if (firebaseUser) {
                // console.log(firebaseUser)
                setUserPhoto(firebaseUser.photoURL);
                setDisplayName(firebaseUser.displayName);
                myUID.current = firebaseUser.uid;
                firebaseRef.current = firebase.database().ref("WebDev/" + firebaseUser.uid);
                loadProjects();
            }
            else history.push("/auth");
        });
    }, []);

    function loadProjects() {
        firebaseRef.current.once("value").then(snap => {
            startBackdrop(false);
            // const key = snap.key;
            // const project = { ...snap.val(), key: key };
            // setProjects(prevProjects => [...prevProjects, project]);
            // console.log(snap.val())
            try {
                noProjects.current.style.display = 'block';
            } catch (e) {
                //fuck you error
            }
            let tempProjects = [];
            for (let i in snap.val()) {
                const key = i;
                const project = { ...snap.val()[i], key: key };
                tempProjects.push(project);
                try {
                    noProjects.current.style.display = 'none';
                } catch (e) {
                    //fuck you error
                }
            }
            setProjects(tempProjects);

        })
    }

    function deleteProject(projectToBeDeleted) {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                firebaseRef.current.child(projectToBeDeleted).remove(); loadProjects();
                Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )
            }
        })
    }

    return (
        <div>
            <Backdrop className={classes.backdrop} open={open} style={{ zIndex: 5 }}>
                <CircularProgress style={{ color: '#50C0FF' }} />
            </Backdrop>
            <div className={classes.header}>
                <Link to="/"><div className={classes.brandingName}>Xper</div></Link>
                <IconButton className={classes.photoURL} onClick={handleClick}>
                    <Avatar style={{ height: "30px", width: "30px" }} alt={displayName} src={userPhoto} />
                </IconButton>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem className={classes.menu} onClick={() => { window.open("https://github.com/Jaagrav/Xper", '_blank') }}>Source Code</MenuItem>
                    <MenuItem className={classes.menu} onClick={() => { firebase.auth().signOut(); }}>Logout</MenuItem>
                </Menu>
            </div>
            <div className={classes.projectsContainer}>
                <div className={classes.noProjects} ref={noProjects}>Looks like you don't have any projects<br /><br />Click on the add button to create your first project!</div>
                <div className={classes.projectsGrid}>
                    {projects.map(project => (
                        <Card className={classes.root} key={project.key}>
                            <CardContent>
                                <Link to={"/edit/" + myUID.current + "/" + project.key + "/"}>
                                    <Typography className={classes.title} variant="h5" component="h2">
                                        {project.name}
                                    </Typography></Link> <br />
                                <Typography className={classes.pos} variant="body2" component="p">
                                    Created: {project.created}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button className={classes.openBtn} startIcon={<LaunchIcon />} size="small" onClick={() => { startBackdrop(true); history.push("/edit/" + myUID.current + "/" + project.key + "/") }}>Open</Button>
                                <Button className={classes.openBtn} startIcon={<LanguageIcon />} size="small" onClick={() => { window.open(("/deploy/" + myUID.current + "/" + project.key + "/"), "_blank") }}>Visit</Button>
                                <Button className={classes.deleteBtn} startIcon={<DeleteIcon />} size="small" onClick={() => { deleteProject(project.key) }}>Delete</Button>
                            </CardActions>
                        </Card>
                    ))}
                </div>
            </div>
            <Fab color="primary" aria-label="add" className={classes.fabBtn} onClick={makeNewProject}>
                <AddIcon />
            </Fab>
        </div>
    )
}

export default Projectspage
