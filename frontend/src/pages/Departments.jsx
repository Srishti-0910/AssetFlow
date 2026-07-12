import React, { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import DataTable from "../components/DataTable";
import SearchBar from "../components/SearchBar";
import FormModal from "../components/FormModal";
import ConfirmDialog from "../components/ConfirmDialog";

import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../api/departmentApi";

export default function Departments() {
  const [departments, setDepartments] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    departmentHead: "",
  });

  useEffect(() => {
    loadDepartments();
  }, []);

  async function loadDepartments() {
    try {
      setLoading(true);

      const data = await getDepartments();

      setDepartments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filteredDepartments = useMemo(() => {
    return departments.filter((department) =>
      department.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [departments, search]);
    const columns = [
    {
      key: "name",
      title: "Department",
    },

    {
      key: "departmentHead",
      title: "Department Head",
      render: (row) => row.departmentHead || "-",
    },

    {
      key: "description",
      title: "Description",
    },

    {
      key: "status",
      title: "Status",
      render: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            row.status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.status}
        </span>
      ),
    },

    {
      key: "actions",
      title: "Actions",

      render: (row) => (
        <div className="flex gap-2">

          <button
            onClick={() => {
              setSelectedDepartment(row);

              setForm({
                name: row.name,
                description: row.description,
                departmentHead: row.departmentHead,
              });

              setOpenModal(true);
            }}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Edit
          </button>

          <button
            onClick={() => {
              setSelectedDepartment(row);
              setDeleteOpen(true);
            }}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>

        </div>
      ),
    },
  ];

  async function handleSave() {
    try {

      if (selectedDepartment) {

        await updateDepartment(
          selectedDepartment._id,
          form
        );

      } else {

        await createDepartment(form);

      }

      setOpenModal(false);

      setSelectedDepartment(null);

      setForm({
        name: "",
        description: "",
        departmentHead: "",
      });

      loadDepartments();

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong");
    }
  }

  async function handleDelete() {
    try {

      await deleteDepartment(selectedDepartment._id);

      setDeleteOpen(false);

      loadDepartments();

    } catch (err) {
      console.error(err);
    }
  }
    return (
    <Layout>
      <div className="p-8">

        <div className="flex justify-between items-center mb-6">

          <div>
            <h1 className="text-3xl font-bold">
              Departments
            </h1>

            <p className="text-muted mt-1">
              Manage all departments in AssetFlow
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedDepartment(null);

              setForm({
                name: "",
                description: "",
                departmentHead: "",
              });

              setOpenModal(true);
            }}
            className="px-5 py-3 rounded-lg bg-amber text-black font-semibold hover:opacity-90"
          >
            + Add Department
          </button>

        </div>

        <div className="mb-5">

          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search department..."
          />

        </div>

        <DataTable
          columns={columns}
          data={filteredDepartments}
          loading={loading}
          emptyMessage="No departments found"
        />

        <FormModal
          title={
            selectedDepartment
              ? "Edit Department"
              : "Add Department"
          }
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
        >

          <div className="space-y-4">

            <input
              type="text"
              placeholder="Department Name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              className="w-full border border-border rounded-lg p-3 bg-panel"
            />

            <input
              type="text"
              placeholder="Department Head"
              value={form.departmentHead}
              onChange={(e) =>
                setForm({
                  ...form,
                  departmentHead: e.target.value,
                })
              }
              className="w-full border border-border rounded-lg p-3 bg-panel"
            />

            <textarea
              rows="4"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
              className="w-full border border-border rounded-lg p-3 bg-panel"
            />

            <div className="flex justify-end">

              <button
                onClick={handleSave}
                className="px-5 py-3 rounded-lg bg-amber text-black font-semibold"
              >
                Save Department
              </button>

            </div>

          </div>

        </FormModal>

        <ConfirmDialog
          open={deleteOpen}
          title="Delete Department"
          message="Are you sure you want to deactivate this department?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteOpen(false)}
        />

      </div>
    </Layout>
  );
}