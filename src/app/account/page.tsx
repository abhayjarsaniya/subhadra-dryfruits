"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth, SavedAddress } from "@/lib/auth-context";
import { formatPrice } from "@/lib/format";
import {
  User as UserIcon,
  ShoppingBag,
  MapPin,
  Shield,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  Check,
  ChevronRight,
  Phone,
  Mail,
  Link as LinkIcon,
  AlertCircle,
} from "lucide-react";
import { AuthModal } from "@/components/auth-modal";
import { ConfirmationResult } from "firebase/auth";

export default function AccountPage() {
  const router = useRouter();
  const {
    user,
    profile,
    addresses,
    loading,
    logout,
    updateCustomerProfile,
    addSavedAddress,
    updateSavedAddress,
    deleteSavedAddress,
    setDefaultSavedAddress,
    linkGoogleAccount,
    linkPhoneAccount,
    confirmLinkPhone,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<"orders" | "addresses" | "profile" | "security">("orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // Address modal state
  const [isAddrModalOpen, setIsAddrModalOpen] = useState(false);
  const [editAddr, setEditAddr] = useState<SavedAddress | null>(null);
  const [addrForm, setAddrForm] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "Gujarat",
    pincode: "",
    isDefault: false,
  });

  // Profile edit state
  const [profileName, setProfileName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // Link Phone state
  const [linkPhoneModal, setLinkPhoneModal] = useState(false);
  const [linkPhoneNum, setLinkPhoneNum] = useState("");
  const [linkPhoneStep, setLinkPhoneStep] = useState<"phone" | "otp">("phone");
  const [linkConfirmation, setLinkConfirmation] = useState<ConfirmationResult | null>(null);
  const [linkOtp, setLinkOtp] = useState("");
  const [linkLoading, setLinkLoading] = useState(false);
  const [linkError, setLinkError] = useState("");

  // Auth modal if not logged in
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    if (profile) {
      setProfileName(profile.displayName || "");
    }
  }, [profile]);

  // Fetch customer orders for this UID
  useEffect(() => {
    if (!user) {
      setLoadingOrders(false);
      return;
    }

    async function fetchCustomerOrders() {
      setLoadingOrders(true);
      try {
        const res = await fetch(`/api/customer/orders?uid=${user?.uid}`);
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch {
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    }

    fetchCustomerOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#6E2635] border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#6E2635]/10 text-2xl text-[#6E2635]">
          <UserIcon className="h-8 w-8" />
        </div>
        <h1 className="mt-5 font-serif text-3xl font-bold text-ink">Customer Account</h1>
        <p className="mt-2 text-sm text-stone-500">
          Sign in to access your order tracking, personal details, and delivery addresses.
        </p>
        <button
          type="button"
          onClick={() => setAuthModalOpen(true)}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#6E2635] px-6 py-3 text-xs font-semibold text-white shadow-md hover:bg-[#5A1E2B]"
        >
          <span>Sign In / Register</span>
        </button>
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </div>
    );
  }

  // Address modal handlers
  function openAddAddress() {
    setEditAddr(null);
    setAddrForm({
      fullName: profile?.displayName || "",
      phone: profile?.phoneNumber || user?.phoneNumber || "",
      addressLine1: "",
      addressLine2: "",
      city: "Ahmedabad",
      state: "Gujarat",
      pincode: "380015",
      isDefault: addresses.length === 0,
    });
    setIsAddrModalOpen(true);
  }

  function openEditAddress(addr: SavedAddress) {
    setEditAddr(addr);
    setAddrForm({
      fullName: addr.fullName,
      phone: addr.phone,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 || "",
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      isDefault: !!addr.isDefault,
    });
    setIsAddrModalOpen(true);
  }

  async function handleSaveAddress(e: React.FormEvent) {
    e.preventDefault();
    if (editAddr) {
      await updateSavedAddress(editAddr.id, addrForm);
    } else {
      await addSavedAddress(addrForm);
    }
    setIsAddrModalOpen(false);
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSaved(false);
    try {
      await updateCustomerProfile({ displayName: profileName });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } finally {
      setSavingProfile(false);
    }
  }

  // Phone linking flow
  async function handleSendLinkOtp(e: React.FormEvent) {
    e.preventDefault();
    setLinkLoading(true);
    setLinkError("");
    try {
      const conf = await linkPhoneAccount(linkPhoneNum, "link-recaptcha");
      setLinkConfirmation(conf);
      setLinkPhoneStep("otp");
    } catch (err: any) {
      setLinkError(err.message || "Failed to send OTP for account linking.");
    } finally {
      setLinkLoading(false);
    }
  }

  async function handleConfirmLinkOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!linkConfirmation) return;
    setLinkLoading(true);
    setLinkError("");
    try {
      await confirmLinkPhone(linkConfirmation, linkOtp);
      setLinkPhoneModal(false);
    } catch (err: any) {
      setLinkError(err.message || "Failed to link phone number.");
    } finally {
      setLinkLoading(false);
    }
  }

  // Tracking steps helper
  const pipeline = [
    { key: "pending", label: "Order Placed" },
    { key: "confirmed", label: "Confirmed" },
    { key: "processing", label: "Processing" },
    { key: "packed", label: "Packed" },
    { key: "shipped", label: "Shipped" },
    { key: "delivered", label: "Delivered" },
  ];

  function getStepIndex(status: string) {
    const idx = pipeline.findIndex((p) => p.key === status);
    return idx === -1 ? 0 : idx;
  }

  return (
    <div className="bg-[#FAF8F6] min-h-screen py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Top Profile Banner */}
        <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-xs sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#6E2635] text-xl font-bold text-white shadow-md shadow-[#6E2635]/20">
                {profile?.photoURL ? (
                  <Image
                    src={profile.photoURL}
                    alt={profile.displayName || "Avatar"}
                    width={64}
                    height={64}
                    className="h-full w-full rounded-2xl object-cover"
                  />
                ) : (
                  (profile?.displayName?.[0] || user.phoneNumber?.[0] || "U").toUpperCase()
                )}
              </div>
              <div>
                <h1 className="font-serif text-2xl font-bold text-ink sm:text-3xl">
                  {profile?.displayName || "Subhadra Guest Member"}
                </h1>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-stone-500">
                  {profile?.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5 text-stone-400" />
                      <span>{profile.email}</span>
                    </span>
                  )}
                  {profile?.phoneNumber && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 text-stone-400" />
                      <span>{profile.phoneNumber}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={async () => {
                await logout();
                router.push("/");
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-8 flex gap-2 border-t border-stone-100 pt-4 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
                activeTab === "orders"
                  ? "bg-[#6E2635] text-white shadow-xs"
                  : "text-stone-600 hover:bg-stone-50"
              }`}
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>My Orders ({orders.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("addresses")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
                activeTab === "addresses"
                  ? "bg-[#6E2635] text-white shadow-xs"
                  : "text-stone-600 hover:bg-stone-50"
              }`}
            >
              <MapPin className="h-3.5 w-3.5" />
              <span>Saved Addresses ({addresses.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
                activeTab === "profile"
                  ? "bg-[#6E2635] text-white shadow-xs"
                  : "text-stone-600 hover:bg-stone-50"
              }`}
            >
              <UserIcon className="h-3.5 w-3.5" />
              <span>Profile Information</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
                activeTab === "security"
                  ? "bg-[#6E2635] text-white shadow-xs"
                  : "text-stone-600 hover:bg-stone-50"
              }`}
            >
              <LinkIcon className="h-3.5 w-3.5" />
              <span>Connected Accounts</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === "orders" && (
          <div className="mt-8 space-y-4">
            {loadingOrders ? (
              <div className="rounded-3xl border border-stone-200 bg-white p-12 text-center text-xs text-stone-400">
                Loading your orders...
              </div>
            ) : orders.length === 0 ? (
              <div className="rounded-3xl border border-stone-200 bg-white p-12 text-center">
                <ShoppingBag className="mx-auto h-12 w-12 text-stone-300" />
                <h3 className="mt-3 font-serif text-lg font-bold text-ink">No orders yet</h3>
                <p className="mt-1 text-xs text-stone-400">
                  You haven&apos;t placed any orders yet. Explore our fresh harvests and hampers!
                </p>
                <Link
                  href="/"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#6E2635] px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#5A1E2B]"
                >
                  <span>Start Shopping</span>
                </Link>
              </div>
            ) : (
              orders.map((ord) => {
                const currentIdx = getStepIndex(ord.order_status);
                return (
                  <div
                    key={ord.id}
                    className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-xs sm:p-7"
                  >
                    {/* Header */}
                    <div className="flex flex-col gap-2 border-b border-stone-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-base font-bold text-ink sm:text-lg">
                            {ord.order_number}
                          </span>
                          <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-600 uppercase">
                            {ord.payment_method}
                          </span>
                        </div>
                        <p className="text-xs text-stone-400">
                          Placed on {new Date(ord.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-serif text-lg font-bold text-[#6E2635]">
                          {formatPrice(ord.total_amount)}
                        </p>
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${
                            ord.order_status === "delivered"
                              ? "bg-emerald-50 text-emerald-700"
                              : ord.order_status === "cancelled"
                              ? "bg-rose-50 text-rose-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {ord.order_status}
                        </span>
                      </div>
                    </div>

                    {/* Order Tracking Timeline */}
                    {ord.order_status !== "cancelled" && (
                      <div className="my-6">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-3">
                          Live Tracking
                        </p>
                        <div className="grid grid-cols-6 gap-2">
                          {pipeline.map((step, idx) => {
                            const isCompleted = idx <= currentIdx;
                            const isCurrent = idx === currentIdx;
                            return (
                              <div key={step.key} className="text-center">
                                <div
                                  className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition ${
                                    isCurrent
                                      ? "bg-[#6E2635] text-white ring-4 ring-[#6E2635]/20"
                                      : isCompleted
                                      ? "bg-emerald-600 text-white"
                                      : "bg-stone-100 text-stone-400"
                                  }`}
                                >
                                  {isCompleted ? "✓" : idx + 1}
                                </div>
                                <p
                                  className={`mt-1.5 text-[10px] font-semibold line-clamp-1 ${
                                    isCurrent
                                      ? "text-[#6E2635]"
                                      : isCompleted
                                      ? "text-stone-800"
                                      : "text-stone-400"
                                  }`}
                                >
                                  {step.label}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Items List */}
                    <div className="mt-4 divide-y divide-stone-100 border-t border-stone-100 pt-2">
                      {ord.items?.map((item: any, i: number) => (
                        <div key={i} className="flex items-center justify-between py-2.5">
                          <div className="flex items-center gap-3">
                            {item.image && (
                              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-stone-100 border border-stone-200">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div>
                              <p className="text-xs font-semibold text-ink">{item.name}</p>
                              <p className="text-[11px] text-stone-400">
                                Variant: {item.weight} × Qty: {item.qty}
                              </p>
                            </div>
                          </div>
                          <p className="font-serif text-xs font-bold text-ink">
                            {formatPrice(item.price * item.qty)}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Delivery Address summary */}
                    <div className="mt-4 rounded-2xl bg-[#FAF8F6] p-3.5 text-xs text-stone-600">
                      <p className="font-semibold text-stone-800">Delivering To:</p>
                      <p>
                        {ord.customer_name} ({ord.customer_phone})
                      </p>
                      <p>
                        {ord.address_line1}, {ord.city}, {ord.state} - {ord.pincode}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: Saved Addresses */}
        {activeTab === "addresses" && (
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-ink">Delivery Addresses</h2>
                <p className="text-xs text-stone-400">Manage saved shipping addresses for 1-click checkout</p>
              </div>
              <button
                type="button"
                onClick={openAddAddress}
                className="inline-flex items-center gap-2 rounded-xl bg-[#6E2635] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#5A1E2B]"
              >
                <Plus className="h-4 w-4" />
                <span>Add New Address</span>
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="relative rounded-2xl border border-stone-200/80 bg-white p-5 shadow-xs"
                >
                  {addr.isDefault && (
                    <span className="absolute right-4 top-4 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      DEFAULT
                    </span>
                  )}
                  <h3 className="font-semibold text-ink text-sm">{addr.fullName}</h3>
                  <p className="text-xs text-stone-500 mt-0.5">{addr.phone}</p>
                  <p className="text-xs text-stone-600 mt-2">
                    {addr.addressLine1}
                    {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                  </p>
                  <p className="text-xs text-stone-600">
                    {addr.city}, {addr.state} - {addr.pincode}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3">
                    {!addr.isDefault && (
                      <button
                        type="button"
                        onClick={() => setDefaultSavedAddress(addr.id)}
                        className="text-xs font-semibold text-[#6E2635] hover:underline"
                      >
                        Set as Default
                      </button>
                    )}
                    <div className="flex items-center gap-2 ml-auto">
                      <button
                        type="button"
                        onClick={() => openEditAddress(addr)}
                        className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-50 hover:text-stone-700"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteSavedAddress(addr.id)}
                        className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-50 hover:text-rose-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Profile Information */}
        {activeTab === "profile" && (
          <div className="mt-8 max-w-xl">
            <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-xs sm:p-8">
              <h2 className="font-serif text-xl font-bold text-ink">Personal Information</h2>
              <p className="text-xs text-stone-400 mt-1">Update your display name and contact preferences</p>

              {profileSaved && (
                <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="mt-1 h-11 w-full rounded-xl border border-stone-300 px-4 text-xs text-ink outline-none focus:border-[#6E2635]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    value={profile?.email || "Not linked"}
                    className="mt-1 h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-xs text-stone-400 outline-none"
                  />
                  <p className="mt-1 text-[11px] text-stone-400">
                    Linked via authentication provider
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    disabled
                    value={profile?.phoneNumber || "Not linked"}
                    className="mt-1 h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-xs text-stone-400 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="mt-2 flex h-11 items-center justify-center gap-2 rounded-xl bg-[#6E2635] px-6 text-xs font-semibold text-white shadow-xs hover:bg-[#5A1E2B]"
                >
                  {savingProfile ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tab 4: Connected Accounts & Account Linking */}
        {activeTab === "security" && (
          <div className="mt-8 max-w-xl">
            <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-xs sm:p-8 space-y-6">
              <div>
                <h2 className="font-serif text-xl font-bold text-ink">Account Linking</h2>
                <p className="text-xs text-stone-400 mt-1">
                  Connect both Google and your Phone Number to the same account so you can sign in with either
                </p>
              </div>

              {/* Google Link Status */}
              <div className="flex items-center justify-between rounded-2xl border border-stone-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100">
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink">Google Account</p>
                    <p className="text-[11px] text-stone-500">
                      {profile?.email ? `Connected: ${profile.email}` : "Not connected"}
                    </p>
                  </div>
                </div>

                {!profile?.email && (
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await linkGoogleAccount();
                        alert("Google account connected successfully!");
                      } catch (err: any) {
                        alert(err.message);
                      }
                    }}
                    className="rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                  >
                    Connect
                  </button>
                )}
              </div>

              {/* Phone Link Status */}
              <div className="flex items-center justify-between rounded-2xl border border-stone-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-[#6E2635]">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink">Mobile Phone Number</p>
                    <p className="text-[11px] text-stone-500">
                      {profile?.phoneNumber ? `Connected: ${profile.phoneNumber}` : "Not connected"}
                    </p>
                  </div>
                </div>

                {!profile?.phoneNumber && (
                  <button
                    type="button"
                    onClick={() => {
                      setLinkPhoneNum("");
                      setLinkOtp("");
                      setLinkPhoneStep("phone");
                      setLinkPhoneModal(true);
                    }}
                    className="rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#6E2635] hover:bg-stone-50"
                  >
                    Link Phone
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Address Create/Edit Modal */}
      {isAddrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-2xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="font-serif text-lg font-bold text-ink">
              {editAddr ? "Edit Address" : "Add Delivery Address"}
            </h3>
            <form onSubmit={handleSaveAddress} className="mt-4 space-y-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase text-stone-600">Full Name *</label>
                <input
                  type="text"
                  required
                  value={addrForm.fullName}
                  onChange={(e) => setAddrForm({ ...addrForm, fullName: e.target.value })}
                  className="mt-1 h-10 w-full rounded-xl border border-stone-300 px-3 text-xs outline-none focus:border-[#6E2635]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-stone-600">Mobile Phone *</label>
                <input
                  type="tel"
                  required
                  value={addrForm.phone}
                  onChange={(e) => setAddrForm({ ...addrForm, phone: e.target.value })}
                  className="mt-1 h-10 w-full rounded-xl border border-stone-300 px-3 text-xs outline-none focus:border-[#6E2635]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-stone-600">
                  Flat, House No., Building *
                </label>
                <input
                  type="text"
                  required
                  value={addrForm.addressLine1}
                  onChange={(e) => setAddrForm({ ...addrForm, addressLine1: e.target.value })}
                  className="mt-1 h-10 w-full rounded-xl border border-stone-300 px-3 text-xs outline-none focus:border-[#6E2635]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-stone-600">Area, Street, Landmark</label>
                <input
                  type="text"
                  value={addrForm.addressLine2}
                  onChange={(e) => setAddrForm({ ...addrForm, addressLine2: e.target.value })}
                  className="mt-1 h-10 w-full rounded-xl border border-stone-300 px-3 text-xs outline-none focus:border-[#6E2635]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-stone-600">City *</label>
                  <input
                    type="text"
                    required
                    value={addrForm.city}
                    onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })}
                    className="mt-1 h-10 w-full rounded-xl border border-stone-300 px-3 text-xs outline-none focus:border-[#6E2635]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-stone-600">Pincode *</label>
                  <input
                    type="text"
                    required
                    value={addrForm.pincode}
                    onChange={(e) => setAddrForm({ ...addrForm, pincode: e.target.value })}
                    className="mt-1 h-10 w-full rounded-xl border border-stone-300 px-3 text-xs outline-none focus:border-[#6E2635]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="defaultAddr"
                  checked={addrForm.isDefault}
                  onChange={(e) => setAddrForm({ ...addrForm, isDefault: e.target.checked })}
                  className="h-4 w-4 rounded border-stone-300 text-[#6E2635]"
                />
                <label htmlFor="defaultAddr" className="text-xs text-stone-600 font-medium">
                  Set as default delivery address
                </label>
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddrModalOpen(false)}
                  className="h-10 flex-1 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 flex-1 rounded-xl bg-[#6E2635] text-xs font-semibold text-white shadow-xs"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Link Phone Modal */}
      {linkPhoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-2xs">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="font-serif text-lg font-bold text-ink">Link Phone Number</h3>
            <p className="text-xs text-stone-500 mt-1">Receive an SMS code to verify your phone number</p>

            <div id="link-recaptcha" />

            {linkError && (
              <div className="mt-3 rounded-xl bg-rose-50 p-2.5 text-xs text-rose-700 font-medium">
                {linkError}
              </div>
            )}

            {linkPhoneStep === "phone" ? (
              <form onSubmit={handleSendLinkOtp} className="mt-4 space-y-3">
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile number"
                  value={linkPhoneNum}
                  onChange={(e) => setLinkPhoneNum(e.target.value)}
                  className="h-11 w-full rounded-xl border border-stone-300 px-3 text-xs outline-none focus:border-[#6E2635]"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setLinkPhoneModal(false)}
                    className="h-10 flex-1 rounded-xl border border-stone-200 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={linkLoading}
                    className="h-10 flex-1 rounded-xl bg-[#6E2635] text-xs font-semibold text-white"
                  >
                    {linkLoading ? "Sending..." : "Send OTP"}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleConfirmLinkOtp} className="mt-4 space-y-3">
                <input
                  type="text"
                  required
                  placeholder="6-digit code"
                  value={linkOtp}
                  onChange={(e) => setLinkOtp(e.target.value)}
                  className="h-11 w-full rounded-xl border border-stone-300 px-3 text-center font-mono text-base outline-none focus:border-[#6E2635]"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setLinkPhoneStep("phone")}
                    className="h-10 flex-1 rounded-xl border border-stone-200 text-xs font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={linkLoading}
                    className="h-10 flex-1 rounded-xl bg-[#6E2635] text-xs font-semibold text-white"
                  >
                    {linkLoading ? "Verifying..." : "Verify & Link"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
