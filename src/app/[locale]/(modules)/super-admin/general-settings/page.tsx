"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SidebarLayout } from "@/components/shared/sidebar-layout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

  type Office = {
    name: string;
    code: string;
    type: string;
    description: string;
  };


  

export default function GeneralSettings() {

    const [offices, setOffices] = useState<Office[]>([]);
    const [officeForm, setOfficeForm] = useState<Office>({
      name: "",
      code: "",
      type: "",
      description: "",
    });
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editValue, setEditValue] = useState<Office | null>(null);

  const handleAddOffice = (e: React.FormEvent) => {
    e.preventDefault();
    if (officeForm.name.trim() && officeForm.code.trim()) {
      setOffices((prev) => [...prev, { ...officeForm }]);
      setOfficeForm({ name: "", code: "", type: "", description: "" });
    }
  };

  const handleEditClick = (idx: number) => {
    setEditingIndex(idx);
    setEditValue(offices[idx]);
  };

  const handleEditSave = (idx: number) => {
    if (editValue && editValue.name.trim() && editValue.code.trim()) {
      setOffices((prev) =>
        prev.map((o, i) => (i === idx ? { ...editValue } : o))
      );
      setEditingIndex(null);
      setEditValue(null);
    }
  };

  const handleEditCancel = () => {
    setEditingIndex(null);
    setEditValue(null);
  };

  return (
    <SidebarLayout title="General Settings">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <Tabs defaultValue="offices" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="offices">Offices</TabsTrigger>
              <TabsTrigger value="departments">Departments</TabsTrigger>
              <TabsTrigger value="roles">Roles</TabsTrigger>
              <TabsTrigger value="other">Other</TabsTrigger>
            </TabsList>
            <TabsContent value="offices">
              <section className="bg-white">
                <h2 className="text-xl font-semibold mb-6">Offices</h2>
                <form
                  onSubmit={handleAddOffice}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end mb-6"
                >
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="officeName">Office Name</Label>
                    <Input
                      id="officeName"
                      name="officeName"
                      placeholder="Enter office name"
                      value={officeForm.name}
                      onChange={(e) => setOfficeForm(f => ({ ...f, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="officeCode">Office Code</Label>
                    <Input
                      id="officeCode"
                      name="officeCode"
                      placeholder="Enter office code"
                      value={officeForm.code}
                      onChange={(e) => setOfficeForm(f => ({ ...f, code: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="officeType">Office Type</Label>
                    <select
                      id="officeType"
                      name="officeType"
                      className="border px-3 py-2 rounded"
                      value={officeForm.type}
                      onChange={(e) => setOfficeForm(f => ({ ...f, type: e.target.value }))}
                    >
                      <option value="">Select type</option>
                      <option value="Head Office">Head Office</option>
                      <option value="Branch">Branch</option>
                      <option value="Sub Office">Sub Office</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1 sm:col-span-2">
                    <Label htmlFor="officeDescription">Description</Label>
                    <Input
                      id="officeDescription"
                      name="officeDescription"
                      placeholder="Description (optional)"
                      value={officeForm.description}
                      onChange={(e) => setOfficeForm(f => ({ ...f, description: e.target.value }))}
                    />
                  </div>
                  <Button type="submit" className="w-[150px]">Add Office</Button>
                </form>
                <div className="mt-2">
                  {offices.length === 0 ? (
                    <div className="text-gray-500 text-sm">
                      No offices added yet.
                    </div>
                  ) : (
                  <ul className="list-disc pl-6 space-y-1">
                    {offices.map((office, idx) => (
                      <li
                        key={idx}
                        className="text-base flex flex-col sm:flex-row sm:items-center gap-2"
                      >
                        {editingIndex === idx && editValue ? (
                          <>
                            <div className="flex flex-col sm:flex-row gap-2 w-full">
                              <Input
                                value={editValue.name}
                                onChange={(e) => setEditValue(f => f ? { ...f, name: e.target.value } : f)}
                                className="w-auto"
                                placeholder="Office Name"
                                autoFocus
                              />
                              <Input
                                value={editValue.code}
                                onChange={(e) => setEditValue(f => f ? { ...f, code: e.target.value } : f)}
                                className="w-auto"
                                placeholder="Code"
                              />
                              <select
                                className="border px-3 py-2 rounded"
                                value={editValue.type}
                                onChange={(e) => setEditValue(f => f ? { ...f, type: e.target.value } : f)}
                              >
                                <option value="">Select type</option>
                                <option value="Head Office">Head Office</option>
                                <option value="Branch">Branch</option>
                                <option value="Sub Office">Sub Office</option>
                              </select>
                              <Input
                                value={editValue.description}
                                onChange={(e) => setEditValue(f => f ? { ...f, description: e.target.value } : f)}
                                className="w-auto"
                                placeholder="Description"
                              />
                            </div>
                            <Button
                              size="sm"
                              type="button"
                              onClick={() => handleEditSave(idx)}
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              type="button"
                              variant="outline"
                              onClick={handleEditCancel}
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <span className="font-medium">{office.name}</span>
                            <span className="text-xs text-gray-500">{office.code}</span>
                            <span className="text-xs text-gray-500">{office.type}</span>
                            <span className="text-xs text-gray-500 flex-1">{office.description}</span>
                            <Button
                              size="sm"
                              type="button"
                              variant="outline"
                              onClick={() => handleEditClick(idx)}
                            >
                              Edit
                            </Button>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                  )}
                </div>
              </section>
            </TabsContent>
            <TabsContent value="departments">
              <section className="bg-white">
                <h2 className="text-xl font-semibold mb-6">Departments</h2>
                <div className="text-gray-500 text-sm">
                  Department settings coming soon...
                </div>
              </section>
            </TabsContent>
            <TabsContent value="roles">
              <section className="bg-white">
                <h2 className="text-xl font-semibold mb-6">Roles</h2>
                <div className="text-gray-500 text-sm">
                  Role settings coming soon...
                </div>
              </section>
            </TabsContent>
            <TabsContent value="other">
              <section className="bg-white">
                <h2 className="text-xl font-semibold mb-6">Other Settings</h2>
                <div className="text-gray-500 text-sm">
                  Other settings coming soon...
                </div>
              </section>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </SidebarLayout>
);
};
