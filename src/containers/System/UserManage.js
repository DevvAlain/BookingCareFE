import React, { Component } from 'react';
import { connect } from 'react-redux';
import './UserManage.scss';
import { getAllUsers, createNewUserService, deleteUserService, editUserService } from '../../services/userService';
import ModalUser from './ModalUser';
import ModalEditUser from './ModalEditUser';
import { emitter } from '../../utils/emitter';

class UserManage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            arrUsers: [],
            isOpenModalUser: false,
            isOpenModalEditUser: false,
            userEdit: {},
        };
    };

    async componentDidMount() {
        await this.getAllUsersFromReact();
    };

    getAllUsersFromReact = async () => {
        let response = await getAllUsers('ALL');
        if (response && response.errCode === 0) {
            this.setState({
                arrUsers: response.users,
            });
        }
    }

    handleAddNewUser = () => {
        this.setState ({
            isOpenModalUser: true,
        })
    };

    toggleUserModal = () => {
        this.setState({
            isOpenModalUser:!this.state.isOpenModalUser,
        })
    };

    toggleUserEditModal = () => {
        this.setState({
            isOpenModalEditUser:!this.state.isOpenModalEditUser,
        })
    };

    createNewUser = async (data) => {
        try {
            let response = await createNewUserService(data);
            if (response && response.errCode === 0) { 
                await this.getAllUsersFromReact();
                this.toggleUserModal(); 
                alert('User created successfully!');
                this.setState({
                    isOpenModalUser: false,
                });
                emitter.emit('EVENT_CLEAR_MODAL_DATA' /*{ 'id': 'your id' }cai nay dung de truyen data*/);
            } else {
                alert(response.errMsg);
            }
        } catch (e) {
            console.log('Error while creating user:', e);
        }
    }

    handleDeleteUser = async (user) => {
        // TODO: Implement delete user functionality
        try {
           let res = await deleteUserService(user.id);
           if (res && res.errCode === 0) {
                await this.getAllUsersFromReact();
                alert('User deleted successfully!');
           } else {
                alert(res.errMsg);
           }           
        } catch (e) {
            console.log(e);
        }
    }

    handleEditUser = (user) => {
        this.setState({
            isOpenModalEditUser: true,
            userEdit: user,
        })
    };

    doEditUser = async (user) => {
        try {
            let response = await editUserService(user);
            if (response && response.errCode === 0) {
                await this.getAllUsersFromReact();
                this.toggleUserEditModal();
                alert('User updated successfully!');
            } else {
                alert(response.errMsg);
            }
        } catch (e) {
            console.log('Error while editing user:', e);
        }
    };

    render() {
        let arrUsers = this.state.arrUsers;
        return (
            <div className="users-container">
                <ModalUser
                    isOpen = {this.state.isOpenModalUser}
                    toggleFromParent = {this.toggleUserModal}    
                    createNewUser = {this.createNewUser}
                />
                { 
                this.state.isOpenModalEditUser && 
                <ModalEditUser 
                isOpen = {this.state.isOpenModalEditUser}
                toggleFromParent = {this.toggleUserEditModal}  
                currentUser = {this.state.userEdit}  
                editUser = {this.doEditUser}
                />
                }
                
                <div className='title text-center'>Manage users</div>
                <div className='mx-1'>
                    <button className='btn btn-primary px-3' onClick={() => this.handleAddNewUser ()}>
                        <i className="fa-solid fa-plus"></i>
                        Add new users</button>
                </div>
                <div className='users-table mt-3 mx-1'>
                    <table id="customers">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Address</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                arrUsers && arrUsers.length > 0 && arrUsers.map((user, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{user.email}</td>
                                            <td>{user.firstName}</td>
                                            <td>{user.lastName}</td>
                                            <td>{user.address}</td>
                                            <td>
                                                <button className = 'btn-edit' onClick={() => this.handleEditUser(user)}> <i className="fa-solid fa-pencil"></i></button>
                                                <button className = 'btn-delete' onClick={() => this.handleDeleteUser(user)}> <i className="fa-solid fa-trash"></i></button>
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
