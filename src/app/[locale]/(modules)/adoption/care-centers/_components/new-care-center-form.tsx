"use client";

import { useState } from "react";
import SubmitButton from "@/components/custom/submit-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
} from "@/components/custom/custom-card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRegisterCareCenterMutation } from "@/hooks/adoption/care-center";
import {
  NewCareCenterSchema,
  NewCareCenterSchemaType,
} from "@/schemas/care-centers";
import { ChildCareFacility } from "@/types/child-matching-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Hash, Lock, MapPin, Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const NewCareCenterForm = () => {
  const { mutate, isError } = useRegisterCareCenterMutation();
  const [formData, setFormData] = useState<Partial<ChildCareFacility>>({
    name: "",
    type: "NGO",
    phone: "",
    email: "",
    region: "Addis Ababa",
    subCity: "",
    woreda: "",
    kebele: "",
    houseNumber: "",
    place: "",
    description: "",
    childrenAgeRange: { min: 0, max: 18 },
    orgUnitId: undefined,
    contactPerson: "",
    loginUsername: "",
  });
  const [password, setPassword] = useState("");

  const form = useForm<NewCareCenterSchemaType>({
    resolver: zodResolver(NewCareCenterSchema),
    defaultValues: {},
  });

  async function onSubmit(values: NewCareCenterSchemaType) {
    //TODO: handle submission here
    console.log("submitting values: ", JSON.stringify(values));
    if ( isError ) {
      toast.error("An error occurred while registering the care center.");
      return;
    }
    mutate(values);
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add New Care Center</Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px] md:max-w-xl lg:max-w-3xl w-full overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Register New Care Center
            </DialogTitle>
            <DialogDescription>
              Register care centers and related organizations for future use.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <div className="max-w-4xl mx-auto">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Register New Facility</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                          Facility Name
                        </label>
                        <input
                          required
                          className="w-full p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                          Type
                        </label>
                        <select
                          className="w-full p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                          value={formData.type}
                          onChange={(e) =>
                            setFormData({ ...formData, type: e.target.value })
                          }
                        >
                          <option value="NGO">NGO / Private</option>
                          <option value="GOVERNMENT">Government</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                          Org Unit ID
                        </label>
                        <div className="relative">
                          <Hash className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                          <input
                            type="number"
                            className="w-full pl-9 pr-3 p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.orgUnitId || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                orgUnitId:
                                  parseInt(e.target.value) || undefined,
                              })
                            }
                            placeholder="e.g. 101"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                          Age Range (Min - Max)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            className="w-full p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.childrenAgeRange?.min || 0}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                childrenAgeRange: {
                                  ...(formData.childrenAgeRange || { max: 18 }),
                                  min: parseInt(e.target.value),
                                },
                              })
                            }
                            placeholder="Min"
                          />
                          <span className="self-center text-slate-400">-</span>
                          <input
                            type="number"
                            className="w-full p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.childrenAgeRange?.max || 18}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                childrenAgeRange: {
                                  ...(formData.childrenAgeRange || { min: 0 }),
                                  max: parseInt(e.target.value),
                                },
                              })
                            }
                            placeholder="Max"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                          Phone
                        </label>
                        <input
                          className="w-full p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                          value={formData.phone || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                          Email
                        </label>
                        <input
                          type="email"
                          className="w-full p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                          value={formData.email || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    {/* Address Section */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        Address Details
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">
                            Region
                          </label>
                          <input
                            className="w-full p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.region || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                region: e.target.value,
                              })
                            }
                            placeholder="e.g. Addis Ababa"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">
                            Sub-City
                          </label>
                          <select
                            className="w-full p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.subCity || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                subCity: e.target.value,
                              })
                            }
                          >
                            <option value="">Select Sub-City</option>
                            <option value="Bole">Bole</option>
                            <option value="Yeka">Yeka</option>
                            <option value="Kirkos">Kirkos</option>
                            <option value="Arada">Arada</option>
                            <option value="Lideta">Lideta</option>
                            <option value="Nifas Silk">Nifas Silk</option>
                            <option value="Akaki Kality">Akaki Kality</option>
                            <option value="Addis Ketema">Addis Ketema</option>
                            <option value="Gullele">Gullele</option>
                            <option value="Lemi Kura">Lemi Kura</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">
                            Woreda
                          </label>
                          <input
                            className="w-full p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.woreda || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                woreda: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">
                            Kebele
                          </label>
                          <input
                            className="w-full p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.kebele || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                kebele: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">
                            House Number
                          </label>
                          <input
                            className="w-full p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.houseNumber || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                houseNumber: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">
                            Place (Display Name)
                          </label>
                          <input
                            className="w-full p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.place || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                place: e.target.value,
                              })
                            }
                            placeholder="e.g. Near Bole Medhanialem"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        Description / Services
                      </label>
                      <textarea
                        className="w-full p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
                        value={formData.description || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Account & Contact Section */}
                <Card>
                  <CardHeader className="bg-slate-50 border-b border-slate-100">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Lock className="w-4 h-4 text-blue-600" />
                      Account & Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                          Contact Person Name
                        </label>
                        <input
                          required
                          className="w-full p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                          value={formData.contactPerson || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              contactPerson: e.target.value,
                            })
                          }
                          placeholder="e.g. Abebe Kebede"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                          Login Username / Email
                        </label>
                        <input
                          required
                          type="text"
                          className="w-full p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                          value={formData.loginUsername || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              loginUsername: e.target.value,
                            })
                          }
                          placeholder="e.g. hope_center_admin"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                          Password
                        </label>
                        <input
                          type="password"
                          className="w-full p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Set initial password"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {}}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Save className="w-4 h-4 mr-2" />
                    Register Facility & Create Account
                  </Button>
                </div>
              </form>
            </div>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewCareCenterForm;
