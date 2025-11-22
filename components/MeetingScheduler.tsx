"use client";

import { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Mail, Phone, Building, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import type { ScheduleMeetingRequest, MeetingType } from '@/types/meeting';

interface MeetingSchedulerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MeetingScheduler({ isOpen, onClose }: MeetingSchedulerProps) {
    const [loading, setLoading] = useState(false);
    const [meetingTypes, setMeetingTypes] = useState<MeetingType[]>([]);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<ScheduleMeetingRequest>({
        fullName: '',
        email: '',
        phone: '',
        organization: '',
        meetingType: '',
        preferredDate: '',
        preferredTime: '',
        timezone: 'Asia/Kolkata',
        duration: 30,
        subject: '',
        description: '',
        urgencyLevel: 'normal'
    });

    // Fetch meeting types on mount
    useEffect(() => {
        if (isOpen) {
            fetchMeetingTypes();
        }
    }, [isOpen]);

    const fetchMeetingTypes = async () => {
        try {
            const response = await fetch('/api/schedule-meeting');
            const data = await response.json();
            if (data.success) {
                setMeetingTypes(data.meetingTypes);
                if (data.meetingTypes.length > 0) {
                    setFormData(prev => ({ ...prev, meetingType: data.meetingTypes[0].type_name }));
                }
            }
        } catch (err) {
            console.error('Error fetching meeting types:', err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/schedule-meeting', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => {
                    onClose();
                    setSuccess(false);
                    resetForm();
                }, 3000);
            } else {
                setError(data.error || 'Failed to schedule meeting. Please try again.');
            }
        } catch (err) {
            setError('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            fullName: '',
            email: '',
            phone: '',
            organization: '',
            meetingType: meetingTypes[0]?.type_name || '',
            preferredDate: '',
            preferredTime: '',
            timezone: 'Asia/Kolkata',
            duration: 30,
            subject: '',
            description: '',
            urgencyLevel: 'normal'
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Get minimum date (today)
    const getMinDate = () => {
        return new Date().toISOString().split('T')[0];
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto glass-dark rounded-2xl border border-white/10 p-6 sm:p-8">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
                    aria-label="Close"
                >
                    <X size={24} className="text-gray-400" />
                </button>

                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Schedule a Meeting</h2>
                    <p className="text-gray-400">Book a time to connect with our support team via Google Meet</p>
                </div>

                {success ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-premium-emerald/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle size={32} className="text-premium-emerald" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Meeting Scheduled!</h3>
                        <p className="text-gray-400 mb-4">You'll receive a confirmation email with the Google Meet link shortly.</p>
                        <button
                            onClick={() => {
                                onClose();
                                setSuccess(false);
                                resetForm();
                            }}
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-cyan text-white font-semibold hover:opacity-90 transition-opacity"
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Personal Information */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <User size={16} className="inline mr-2" />
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan/50 focus:ring-2 focus:ring-neon-cyan/20 transition-all"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <Mail size={16} className="inline mr-2" />
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan/50 focus:ring-2 focus:ring-neon-cyan/20 transition-all"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <Phone size={16} className="inline mr-2" />
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan/50 focus:ring-2 focus:ring-neon-cyan/20 transition-all"
                                    placeholder="9876543210"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <Building size={16} className="inline mr-2" />
                                    Organization
                                </label>
                                <input
                                    type="text"
                                    name="organization"
                                    value={formData.organization}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan/50 focus:ring-2 focus:ring-neon-cyan/20 transition-all"
                                    placeholder="Your School/Institution"
                                />
                            </div>
                        </div>

                        {/* Meeting Details */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Meeting Type *</label>
                            <select
                                name="meetingType"
                                value={formData.meetingType}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-neon-cyan/50 focus:ring-2 focus:ring-neon-cyan/20 transition-all"
                            >
                                {meetingTypes.map((type) => (
                                    <option key={type.id} value={type.type_name} className="bg-dark-900">
                                        {type.display_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <Calendar size={16} className="inline mr-2" />
                                    Date *
                                </label>
                                <input
                                    type="date"
                                    name="preferredDate"
                                    value={formData.preferredDate}
                                    onChange={handleChange}
                                    min={getMinDate()}
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-neon-cyan/50 focus:ring-2 focus:ring-neon-cyan/20 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <Clock size={16} className="inline mr-2" />
                                    Time *
                                </label>
                                <input
                                    type="time"
                                    name="preferredTime"
                                    value={formData.preferredTime}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-neon-cyan/50 focus:ring-2 focus:ring-neon-cyan/20 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
                                <select
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-neon-cyan/50 focus:ring-2 focus:ring-neon-cyan/20 transition-all"
                                >
                                    <option value="15" className="bg-dark-900">15 min</option>
                                    <option value="30" className="bg-dark-900">30 min</option>
                                    <option value="45" className="bg-dark-900">45 min</option>
                                    <option value="60" className="bg-dark-900">60 min</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                <FileText size={16} className="inline mr-2" />
                                Subject
                            </label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan/50 focus:ring-2 focus:ring-neon-cyan/20 transition-all"
                                placeholder="Brief description of the topic"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Additional Details</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan/50 focus:ring-2 focus:ring-neon-cyan/20 transition-all resize-none"
                                placeholder="Any specific topics or questions you'd like to discuss..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Urgency Level</label>
                            <select
                                name="urgencyLevel"
                                value={formData.urgencyLevel}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-neon-cyan/50 focus:ring-2 focus:ring-neon-cyan/20 transition-all"
                            >
                                <option value="low" className="bg-dark-900">Low - Can wait</option>
                                <option value="normal" className="bg-dark-900">Normal</option>
                                <option value="high" className="bg-dark-900">High - Need soon</option>
                                <option value="urgent" className="bg-dark-900">Urgent - ASAP</option>
                            </select>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                                <AlertCircle size={20} />
                                <span className="text-sm">{error}</span>
                            </div>
                        )}

                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-cyan text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Scheduling...' : 'Schedule Meeting'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
