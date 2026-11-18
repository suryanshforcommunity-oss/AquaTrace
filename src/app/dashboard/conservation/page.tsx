"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { WaterSavingLog, CommunityAdvisory, ForumPost } from "@/types";
import { formatNumber, formatDate, formatDateTime } from "@/lib/utils";
import { Modal } from "@/components/shared/Modal";
import {
  Award,
  Plus,
  ThumbsUp,
  MessageSquare,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  Trophy,
  Filter,
  Camera,
  Share2,
  Bookmark,
  Send,
  Droplet,
} from "lucide-react";

export default function ConservationHubPage() {
  const {
    waterSavingLogs,
    addWaterSavingLog,
    verifyWaterSavingLog,
    advisories,
    forumPosts,
    addForumPost,
    upvoteForumPost,
    selectedSociety,
    currentRole,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<"logs" | "forum" | "advisories">("logs");
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  // Water saving form state
  const [activityCategory, setActivityCategory] =
    useState<WaterSavingLog["activityCategory"]>("ro_reject_reused");
  const [activityTitle, setActivityTitle] = useState("");
  const [description, setDescription] = useState("");
  const [estimatedLiters, setEstimatedLiters] = useState<number>(350);
  const [isMeasured, setIsMeasured] = useState<boolean>(false);
  const [measuredLiters, setMeasuredLiters] = useState<number>(0);
  const [apartmentUnit, setApartmentUnit] = useState("Block A - 402");
  const [residentName, setResidentName] = useState("Aarav Patel");

  // Forum post form state
  const [postTitle, setPostTitle] = useState("");
  const [postCategory, setPostCategory] =
    useState<ForumPost["category"]>("conservation_idea");
  const [postContent, setPostContent] = useState("");

  const totalEstimatedSaved = waterSavingLogs.reduce((acc, curr) => acc + curr.estimatedLitersSaved, 0);
  const totalMeasuredSaved = waterSavingLogs.reduce((acc, curr) => acc + curr.measuredLitersSaved, 0);

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addWaterSavingLog({
      societyId: selectedSociety.id,
      residentName,
      apartmentUnit,
      activityCategory,
      activityTitle,
      description,
      estimatedLitersSaved: estimatedLiters,
      measuredLitersSaved: isMeasured ? measuredLiters : 0,
      isMeasuredByMeter: isMeasured,
    });
    setIsLogModalOpen(false);
    setActivityTitle("");
    setDescription("");
  };

  const handleForumSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addForumPost({
      societyId: selectedSociety.id,
      authorName: currentRole === "admin" ? "Vikram Sethi (Admin)" : "Aarav Patel (Resident)",
      authorRole: currentRole,
      apartmentUnit: currentRole === "admin" ? "Admin Office" : "Block A - 402",
      title: postTitle,
      content: postContent,
      category: postCategory,
    });
    setIsPostModalOpen(false);
    setPostTitle("");
    setPostContent("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-xl text-content-primary md:text-2xl">
              Community Conservation Hub &amp; Forum
            </h1>
            <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
              Core Module 5
            </span>
          </div>
          <p className="mt-1 text-xs text-content-secondary max-w-2xl">
            Log household water-saving actions, participate in society challenges, and exchange peer-reviewed conservation tips.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsLogModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Log Water Saving Action</span>
          </button>
          <button
            onClick={() => setIsPostModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-primary-hover transition"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Post to Forum</span>
          </button>
        </div>
      </div>

      {/* Mandatory Trust Rule Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card text-xs text-slate-700 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-xs text-content-primary">
            Data Trust Standard: Strict Separation of Estimated vs Measured Savings
          </h4>
          <p className="mt-0.5 text-content-secondary leading-relaxed">
            In compliance with our data veracity framework, estimated water savings and physically metered savings are audited and stored separately. Administrator verification confirms the physical activity took place, but does not convert an unmetered estimate into a measured value.
          </p>
        </div>
      </div>

      {/* Top Conservation KPI Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <span className="text-[10px] font-bold uppercase tracking-wider text-content-secondary">
            Estimated Water Saved
          </span>
          <div className="mt-1.5 font-extrabold text-2xl text-emerald-700">
            {formatNumber(totalEstimatedSaved)} L
          </div>
          <span className="text-[11px] text-slate-500">Calculated from activity rubrics</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <span className="text-[10px] font-bold uppercase tracking-wider text-content-secondary">
            Physically Measured Savings
          </span>
          <div className="mt-1.5 font-extrabold text-2xl text-primary">
            {formatNumber(totalMeasuredSaved)} L
          </div>
          <span className="text-[11px] text-primary font-medium">Metered via inline water meters</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <span className="text-[10px] font-bold uppercase tracking-wider text-content-secondary">
            Active Participating Flats
          </span>
          <div className="mt-1.5 font-extrabold text-2xl text-content-primary">
            {new Set(waterSavingLogs.map((l) => l.apartmentUnit)).size} Flats
          </div>
          <span className="text-[11px] text-slate-500">Across 3 apartment blocks</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <span className="text-[10px] font-bold uppercase tracking-wider text-content-secondary">
            Top Conserving Wing
          </span>
          <div className="mt-1.5 font-extrabold text-2xl text-orange">Block A (Wing 2)</div>
          <span className="text-[11px] text-orange-600 font-medium">-14.2% demand reduction</span>
        </div>
      </div>

      {/* Navigation Tabs (Logs / Forum / Advisories) */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-bold text-slate-500">
        <button
          onClick={() => setActiveTab("logs")}
          className={`pb-3 border-b-2 transition ${
            activeTab === "logs" ? "border-primary text-primary" : "border-transparent hover:text-slate-700"
          }`}
        >
          Community Water-Saving Logs ({waterSavingLogs.length})
        </button>
        <button
          onClick={() => setActiveTab("forum")}
          className={`pb-3 border-b-2 transition ${
            activeTab === "forum" ? "border-primary text-primary" : "border-transparent hover:text-slate-700"
          }`}
        >
          Best-Practice Forum &amp; Ideas ({forumPosts.length})
        </button>
        <button
          onClick={() => setActiveTab("advisories")}
          className={`pb-3 border-b-2 transition ${
            activeTab === "advisories" ? "border-primary text-primary" : "border-transparent hover:text-slate-700"
          }`}
        >
          Water Conservation Advisories ({advisories.length})
        </button>
      </div>

      {/* TAB 1: Water-Saving Logs */}
      {activeTab === "logs" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Main Logs List (8 cols) */}
          <div className="space-y-4 lg:col-span-8">
            {waterSavingLogs.map((log) => (
              <div
                key={log.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card hover:shadow-card-hover transition"
              >
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-content-primary">{log.activityTitle}</h3>
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 capitalize">
                        {log.activityCategory.replace(/_/g, " ")}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-content-secondary">
                      <span>Submitted by <strong>{log.residentName}</strong> ({log.apartmentUnit})</span>
                      <span> · {formatDate(log.timestamp)}</span>
                    </div>
                  </div>

                  <div>
                    {log.isVerifiedByAdmin ? (
                      <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Verified by {log.verifiedBy?.split(" ")[0]}</span>
                      </span>
                    ) : currentRole === "admin" ? (
                      <button
                        onClick={() => verifyWaterSavingLog(log.id, "Vikram Sethi (Admin)")}
                        className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-emerald-700 shadow-sm"
                      >
                        Verify Action
                      </button>
                    ) : (
                      <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700">
                        Pending Verification
                      </span>
                    )}
                  </div>
                </div>

                <p className="mt-3 text-xs text-content-secondary leading-relaxed bg-slate-50 p-3 rounded-xl">
                  {log.description}
                </p>

                {/* Split Estimated vs Measured badges */}
                <div className="mt-3 flex flex-wrap items-center justify-between border-t border-slate-100 pt-3 text-xs">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Estimated Savings:</span>
                      <span className="font-extrabold text-sm text-emerald-700">
                        {formatNumber(log.estimatedLitersSaved)} L
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Measured Savings:</span>
                      <span className="font-extrabold text-sm text-primary">
                        {log.isMeasuredByMeter ? `${formatNumber(log.measuredLitersSaved)} L (Metered)` : "— (Unmetered)"}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-400">
                    Activity Type: {log.isMeasuredByMeter ? "Physical Meter Verified" : "Activity-Based Calculation"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Conservation Leaderboard Sidebar (4 cols) */}
          <div className="space-y-4 lg:col-span-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Trophy className="h-5 w-5 text-amber-500" />
                <h3 className="font-bold text-sm text-content-primary">Building Wing Leaderboard</h3>
              </div>

              <div className="mt-3 space-y-2.5">
                {[
                  { wing: "Block A - Wing 2", saved: "14,200 L", reduction: "-14.2%", badge: "1st Place 🥇" },
                  { wing: "Block B - Wing 1", saved: "11,800 L", reduction: "-11.8%", badge: "2nd Place 🥈" },
                  { wing: "Block C - Wing 3", saved: "9,400 L", reduction: "-9.1%", badge: "3rd Place 🥉" },
                  { wing: "Block A - Wing 1", saved: "7,600 L", reduction: "-7.4%", badge: "Active 🎖️" },
                ].map((item, idx) => (
                  <div
                    key={item.wing}
                    className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 text-xs border border-slate-100"
                  >
                    <div>
                      <div className="font-bold text-content-primary">{item.wing}</div>
                      <div className="text-[10px] text-emerald-600 font-semibold">{item.reduction} this month</div>
                    </div>
                    <div className="text-right">
                      <div className="font-extrabold text-primary">{item.saved}</div>
                      <div className="text-[10px] text-slate-500">{item.badge}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Challenge Card */}
            <div className="rounded-2xl bg-gradient-to-br from-primary to-secondary p-5 text-white shadow-card">
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                Monthly Challenge
              </span>
              <h4 className="mt-2 font-bold text-base">The 100-Aerator Society Drive</h4>
              <p className="mt-1 text-xs text-white/80 leading-relaxed">
                Fit 3 LPM tap aerators on all kitchen and washbasin faucets. Over 58 flats have installed aerators this week.
              </p>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span>Progress: 58 / 100 Flats</span>
                <span className="font-bold">58%</span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-white/20 overflow-hidden">
                <div className="h-full bg-aqua rounded-full" style={{ width: "58%" }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Best-Practice Forum */}
      {activeTab === "forum" && (
        <div className="space-y-4">
          {forumPosts.map((post) => (
            <div key={post.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {post.isPinned && (
                      <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                        PINNED NOTICE
                      </span>
                    )}
                    <h3 className="font-bold text-base text-content-primary">{post.title}</h3>
                  </div>
                  <div className="text-xs text-content-secondary">
                    <span>Posted by <strong>{post.authorName}</strong> ({post.apartmentUnit})</span>
                    <span> · {formatDate(post.timestamp)}</span>
                  </div>
                </div>

                <button
                  onClick={() => upvoteForumPost(post.id)}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-primary-light hover:text-primary transition"
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                  <span>{post.upvotes}</span>
                </button>
              </div>

              <p className="mt-3 text-xs text-content-secondary leading-relaxed bg-slate-50/60 p-3 rounded-xl">
                {post.content}
              </p>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-2.5">
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>{post.repliesCount} Community replies</span>
                </span>
                <button
                  onClick={() => alert(`Reply thread for "${post.title}" opened.`)}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Join Discussion →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: Conservation Advisories */}
      {activeTab === "advisories" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {advisories.map((adv) => (
            <div key={adv.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <span>{adv.category.replace(/_/g, " ")}</span>
                  <span>{adv.readTime}</span>
                </div>
                <h3 className="mt-2 font-bold text-base text-content-primary">{adv.title}</h3>
                <p className="mt-2 text-xs text-content-secondary leading-relaxed">{adv.content}</p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                <span>By {adv.author}</span>
                <button
                  onClick={() => alert(`Saved advisory to reading list.`)}
                  className="flex items-center gap-1 text-primary hover:underline font-semibold"
                >
                  <Bookmark className="h-3 w-3" />
                  <span>Save Advisory</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Log Water Saving Action */}
      <Modal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        title="Submit Household Water-Saving Action"
        subtitle="Log your water conservation initiative to inspire the community"
      >
        <form onSubmit={handleSaveSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-content-primary mb-1">Action Title</label>
            <input
              type="text"
              value={activityTitle}
              onChange={(e) => setActivityTitle(e.target.value)}
              placeholder="e.g. Plumbed RO reject pipe to washing machine rinse cycle"
              required
              className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-content-primary mb-1">Category</label>
              <select
                value={activityCategory}
                onChange={(e: any) => setActivityCategory(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
              >
                <option value="ro_reject_reused">RO Reject Water Reused</option>
                <option value="aerator_installed">Tap Aerator Restrictor Fitted</option>
                <option value="greywater_gardening">Greywater Diverted to Garden</option>
                <option value="leak_fixed">Fixed Internal Cistern / Tap Leak</option>
                <option value="car_bucket_wash">Car Wash Switched to 2-Bucket</option>
                <option value="rwh_maintenance">Rooftop RWH Silt Cleaning</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-content-primary mb-1">Apartment Unit</label>
              <input
                type="text"
                value={apartmentUnit}
                onChange={(e) => setApartmentUnit(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-content-primary mb-1">
                Estimated Litres Saved (L)
              </label>
              <input
                type="number"
                value={estimatedLiters}
                onChange={(e) => setEstimatedLiters(Number(e.target.value))}
                min={1}
                required
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none font-bold text-emerald-700"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-content-primary mb-1">
                Physically Metered?
              </label>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isMeasuredCheck"
                  checked={isMeasured}
                  onChange={(e) => setIsMeasured(e.target.checked)}
                  className="h-4 w-4 rounded text-primary focus:ring-0"
                />
                <label htmlFor="isMeasuredCheck" className="text-xs text-slate-700 cursor-pointer">
                  Yes, verified by water meter
                </label>
              </div>
            </div>
          </div>

          {isMeasured && (
            <div>
              <label className="block text-xs font-bold text-content-primary mb-1">
                Measured Litres Saved (L)
              </label>
              <input
                type="number"
                value={measuredLiters}
                onChange={(e) => setMeasuredLiters(Number(e.target.value))}
                min={1}
                required
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none font-bold text-primary"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-content-primary mb-1">Description &amp; Implementation</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="How did you set this up? Any practical tips for your neighbors?"
              rows={3}
              required
              className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
            />
          </div>

          <div className="rounded-xl border border-dashed border-slate-300 p-3 text-center text-xs text-slate-500 cursor-pointer hover:border-emerald-500">
            <Camera className="h-5 w-5 mx-auto text-slate-400 mb-1" />
            <span className="font-semibold text-emerald-700">Attach Evidence Photograph (Optional)</span>
            <p className="text-[10px] text-slate-400">Photo of bucket setup, aerator box, or meter index</p>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsLogModalOpen(false)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 shadow-sm"
            >
              Submit Conservation Log
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: New Forum Post */}
      <Modal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        title="Start a Best-Practice Discussion"
        subtitle="Share ideas, question water schedules, or alert neighbors"
      >
        <form onSubmit={handleForumSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-content-primary mb-1">Topic Title</label>
            <input
              type="text"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              placeholder="e.g. Installing common drip line for basement car wash"
              required
              className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-content-primary mb-1">Category</label>
            <select
              value={postCategory}
              onChange={(e: any) => setPostCategory(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
            >
              <option value="conservation_idea">Conservation Idea</option>
              <option value="question">Question for RWA Committee</option>
              <option value="tanker_alert">Tanker Supply Alert</option>
              <option value="maintenance_request">Common Maintenance Suggestion</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-content-primary mb-1">Discussion Content</label>
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Explain your idea or question clearly..."
              rows={4}
              required
              className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsPostModalOpen(false)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover shadow-sm"
            >
              Publish Topic
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

