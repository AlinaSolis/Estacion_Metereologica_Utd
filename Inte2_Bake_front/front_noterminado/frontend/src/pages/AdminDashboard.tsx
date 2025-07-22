import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './CSS/AdminDashboard.css';
import Swal from 'sweetalert2';

interface User {
  id: number;
  username: string;
}

const AdminDashboard: React.FC = () => {
  const { isLoggedIn, token } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [editId, setEditId] = useState<number | null>(null);
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    if (!token) {
      setError('No hay token de autenticación');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:4000/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Error al obtener usuarios');
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isLoggedIn) fetchUsers();
  }, [isLoggedIn, token]);

  const validatePassword = (password: string): boolean => {
    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&._\-])[A-Za-z\d@$!%*?&._\-]{8,}$/.test(password);
  };

  const handleCreateUser = async () => {
    if (!newUsername || !newPassword) {
      return Swal.fire('Campos incompletos', 'Por favor completa todos los campos.', 'warning');
    }

    if (!validatePassword(newPassword)) {
      return Swal.fire('Contraseña insegura', 'Debe tener mínimo 8 caracteres, una letra, un número y un símbolo.', 'warning');
    }

    if (!token) return Swal.fire('No hay token de autenticación');

    const result = await Swal.fire({
      title: '¿Crear usuario?',
      text: '¿Estás seguro de crear este nuevo usuario?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, crear',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch('http://localhost:4000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: newUsername, password: newPassword }),
      });
      if (!res.ok) {
        const err = await res.json();
        return Swal.fire(err.message || 'Error al crear usuario');
      }
      setNewUsername('');
      setNewPassword('');
      fetchUsers();
      Swal.fire('Usuario creado correctamente', '', 'success');
    } catch {
      Swal.fire('Error en la conexión');
    }
  };

  const startEdit = (user: User) => {
    setEditId(user.id);
    setEditUsername(user.username);
    setEditPassword('');
    setShowPassword(false);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditUsername('');
    setEditPassword('');
    setShowPassword(false);
  };

  const saveEdit = async () => {
    if (!editUsername) return Swal.fire('Nombre requerido');
    if (editPassword && !validatePassword(editPassword)) {
      return Swal.fire('Contraseña insegura', 'Debe tener mínimo 8 caracteres, una letra, un número y un símbolo.', 'warning');
    }

    if (!token) return Swal.fire('No hay token de autenticación');

    const result = await Swal.fire({
      title: '¿Confirmar edición?',
      text: '¿Estás seguro de guardar los cambios de este usuario?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`http://localhost:4000/api/users/${editId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: editUsername,
          password: editPassword || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        return Swal.fire(err.message || 'Error al actualizar');
      }

      cancelEdit();
      fetchUsers();
      Swal.fire('Guardado', 'Usuario actualizado correctamente', 'success');
    } catch {
      Swal.fire('Error', 'Error en la conexión', 'error');
    }
  };

  const deleteUser = async (id: number) => {
    const confirmResult = await Swal.fire({
      title: '¿Seguro que quieres eliminar este usuario?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (!confirmResult.isConfirmed) return;

    if (!token) {
      return Swal.fire('Error', 'No hay token de autenticación', 'error');
    }

    try {
      const res = await fetch(`http://localhost:4000/api/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json();
        return Swal.fire('Error', err.message || 'Error al eliminar', 'error');
      }
      fetchUsers();
      Swal.fire('Eliminado', 'El usuario ha sido eliminado.', 'success');
    } catch {
      Swal.fire('Error', 'Error en la conexión', 'error');
    }
  };

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (!isLoggedIn) {
      Swal.fire('Acceso denegado. Inicia sesión.');
    }
  }, [isLoggedIn]);

  if (!isLoggedIn)
    return (
      <p className="error" style={{ textAlign: 'center', marginTop: '40px' }}>
        Acceso denegado. Inicia sesión.
      </p>
    );

  return (
    <div className="container scrollContainer">
      <div className="card">
        <h2 className="sectionTitle">Crear Nuevo Usuario</h2>
        <div className="formRow">
          <input
            className="input"
            type="text"
            placeholder="Usuario"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
          <div className="password-wrapper">
            <input
              className="input"
              type={showNewPassword ? 'text' : 'password'}
              placeholder="Contraseña segura"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              className="toggle-password"
              onClick={() => setShowNewPassword(!showNewPassword)}
              type="button"
            >
              {showNewPassword ? '🙈' : '👁️'}
            </button>
          </div>
          <button className="btn btn-primary" onClick={handleCreateUser}>
            Crear
          </button>
        </div>
      </div>

      <div className="card">
        <h2 className="sectionTitle">Usuarios Registrados</h2>
        <input
          type="text"
          className="input"
          placeholder="Buscar usuario..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: '20px' }}
        />

        {loading ? (
          <p>Cargando...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : filteredUsers.length === 0 ? (
          <p>No hay usuarios.</p>
        ) : (
          <table className="userTable">
            <thead>
              <tr className="tableHeader">
                <th>ID</th>
                <th>Usuario</th>
                <th>Contraseña (Editar)</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) =>
                editId === u.id ? (
                  <tr key={u.id} className="editingRow">
                    <td>{u.id}</td>
                    <td>
                      <input
                        className="input"
                        type="text"
                        value={editUsername}
                        onChange={(e) => setEditUsername(e.target.value)}
                      />
                    </td>
                    <td>
                      <div className="password-wrapper">
                        <input
                          className="input"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Nueva contraseña (opcional)"
                          value={editPassword}
                          onChange={(e) => setEditPassword(e.target.value)}
                        />
                        <button
                          className="toggle-password"
                          onClick={() => setShowPassword(!showPassword)}
                          type="button"
                        >
                          {showPassword ? '🙈' : '👁️'}
                        </button>
                      </div>
                    </td>
                    <td className="actionsCell">
                      <button className="btn btn-success" onClick={saveEdit}>
                        Guardar
                      </button>
                      <button className="btn btn-danger" onClick={cancelEdit}>
                        Cancelar
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.username}</td>
                    <td>******</td>
                    <td className="actionsCell">
                      <button className="btn btn-primary" onClick={() => startEdit(u)}>
                        Editar
                      </button>
                      <button className="btn btn-danger" onClick={() => deleteUser(u.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
