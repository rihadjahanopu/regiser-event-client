import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle, Phone, GraduationCap, Calendar, User } from "lucide-react";
import axios from "axios";

// Using the internal URL or external if deployed
const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "http://localhost:5000";

async function getRegistration(id: string) {
  try {
    const res = await axios.get(`${API_URL}/api/registration/verify/${id}`);
    return res.data;
  } catch (error: any) {
    console.error("Verification error:", error?.message || error);
    return null;
  }
}

export default async function VerifyPage({ params }: { params: Promise<{ registrationId: string }> }) {
  const resolvedParams = await params;
  const result = await getRegistration(resolvedParams.registrationId);
  const registration = result?.success ? result.registration : null;

  if (!registration) {
    return (
      <div className="h-[100dvh] overflow-y-auto bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md text-center border-red-200 dark:border-red-900 shadow-xl shadow-red-500/10">
          <CardContent className="pt-8 pb-8 space-y-4">
            <div className="mx-auto w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
              <XCircle className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Invalid Ticket</h2>
              <p className="text-slate-500 mt-2">This registration ID does not exist in our system. It might be a fake or incorrect ticket.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isValid = registration.status === "Verified";

  return (
    <div className="h-[100dvh] overflow-y-auto bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        {/* Verification Status Badge */}
        <div className={`p-4 rounded-xl flex items-center justify-center space-x-3 shadow-lg ${
          isValid 
            ? 'bg-green-600 text-white shadow-green-600/20' 
            : 'bg-red-600 text-white shadow-red-600/20'
        }`}>
          {isValid ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
          <h2 className="text-xl font-bold tracking-wide uppercase">
            {isValid ? "Valid Ticket" : "Invalid Status"}
          </h2>
        </div>

        <Card className="border-2 border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className="bg-slate-100 dark:bg-slate-900 p-6 flex flex-col items-center border-b border-slate-200 dark:border-slate-800">
            <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 mb-4">
               <div className="w-24 h-24 bg-slate-200 rounded-lg flex items-center justify-center text-slate-400">
                 <CheckCircle2 className="w-12 h-12" />
               </div>
            </div>
            <h3 className="text-2xl font-bold text-center text-slate-900 dark:text-white">
              {registration.fullName}
            </h3>
            <p className="text-slate-500 font-mono mt-1">{registration.registrationId}</p>
          </div>

          <CardContent className="p-6 space-y-4">
            
            <div className="flex items-center space-x-3 text-slate-700 dark:text-slate-300">
              <Phone className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-sm text-slate-500">Mobile Number</p>
                <p className="font-medium">{registration.mobile}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-slate-700 dark:text-slate-300">
              <GraduationCap className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-sm text-slate-500">Institution</p>
                <p className="font-medium">{registration.schoolName}</p>
                <p className="text-sm">{registration.class} • {registration.subjectGroup}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-slate-700 dark:text-slate-300">
              <User className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-sm text-slate-500">Gender</p>
                <p className="font-medium">{registration.gender}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-slate-700 dark:text-slate-300">
              <Calendar className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-sm text-slate-500">Registration Date</p>
                <p className="font-medium">{new Date(registration.registrationDate).toLocaleString()}</p>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
