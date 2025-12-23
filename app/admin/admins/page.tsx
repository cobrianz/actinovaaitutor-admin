"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Check, Trash2, Shield, AlertTriangle, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Admin {
    id: string
    name: string
    email: string
    role: string
    isVerified: boolean
    isApproved: boolean
    createdAt: string
    lastLogin?: string
}

export default function AdminsPage() {
    const [admins, setAdmins] = useState<Admin[]>([])
    const [loading, setLoading] = useState(true)

    const fetchAdmins = async () => {
        try {
            const res = await fetch('/api/admins')
            const data = await res.json()
            if (data.admins) {
                setAdmins(data.admins)
            }
        } catch (error) {
            console.error(error)
            toast.error('Failed to fetch admins')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAdmins()
    }, [])

    const handleApprove = async (id: string, currentStatus: boolean) => {
        try {
            await fetch('/api/admins', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, isApproved: !currentStatus })
            })
            setAdmins(prev => prev.map(a => a.id === id ? { ...a, isApproved: !currentStatus } : a))
            toast.success(currentStatus ? 'Admin disabled' : 'Admin approved')
        } catch (error) {
            toast.error('Action failed')
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this admin?')) return

        try {
            const res = await fetch(`/api/admins?id=${id}`, { method: 'DELETE' })
            const data = await res.json()

            if (!res.ok) {
                toast.error(data.error || 'Failed to delete')
                return
            }

            setAdmins(prev => prev.filter(a => a.id !== id))
            toast.success('Admin deleted successfully')
        } catch (error) {
            toast.error('Failed to delete')
        }
    }

    if (loading) {
        return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
    }

    const pendingAdmins = admins.filter(a => !a.isApproved)
    const activeAdmins = admins.filter(a => a.isApproved)

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gradient-primary">Admin Management</h1>
                <p className="text-muted-foreground mt-1">Manage system administrators and approvals</p>
            </div>

            {pendingAdmins.length > 0 && (
                <Card className="border-yellow-500/20 bg-yellow-500/5">
                    <CardHeader>
                        <CardTitle className="text-yellow-600 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            Pending Approvals
                        </CardTitle>
                        <CardDescription>
                            These administrators have verified their email but need system approval.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No.</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Registered</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pendingAdmins.map((admin, index) => (
                                    <TableRow key={admin.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell className="font-medium">{admin.name}</TableCell>
                                        <TableCell>{admin.email}</TableCell>
                                        <TableCell>{new Date(admin.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button size="sm" onClick={() => handleApprove(admin.id, false)} className="bg-green-600 hover:bg-green-700">
                                                    <Check className="h-4 w-4 mr-1" /> Approve
                                                </Button>
                                                <Button size="sm" variant="destructive" onClick={() => handleDelete(admin.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Active Administrators
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>No.</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Last Login</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {activeAdmins.map((admin, index) => (
                                <TableRow key={admin.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className="font-medium">{admin.name}</TableCell>
                                    <TableCell>{admin.email}</TableCell>
                                    <TableCell>
                                        {admin.isVerified ? (
                                            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">Verified</Badge>
                                        ) : (
                                            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600">Pending Email</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>{admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : 'Never'}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button size="sm" variant="outline" onClick={() => handleApprove(admin.id, true)}>
                                                Disable
                                            </Button>
                                            <Button size="sm" variant="ghost" onClick={() => handleDelete(admin.id)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
