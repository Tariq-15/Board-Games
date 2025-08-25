"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

export function AdminSettings() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="siteName">Site Name</Label>
            <Input id="siteName" defaultValue="BoardGameHub" />
          </div>
          <div>
            <Label htmlFor="siteDescription">Site Description</Label>
            <Textarea
              id="siteDescription"
              defaultValue="Your ultimate destination for discovering and exploring board games."
            />
          </div>
          <div>
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input id="contactEmail" type="email" defaultValue="admin@boardgamehub.com" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Review Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch id="autoApprove" defaultChecked={false} />
            <Label htmlFor="autoApprove">Auto-approve reviews</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="requireLogin" defaultChecked={true} />
            <Label htmlFor="requireLogin">Require login to review</Label>
          </div>
          <div>
            <Label htmlFor="minReviewLength">Minimum review length (characters)</Label>
            <Input id="minReviewLength" type="number" defaultValue="50" />
          </div>
          <div>
            <Label htmlFor="maxReviewLength">Maximum review length (characters)</Label>
            <Input id="maxReviewLength" type="number" defaultValue="1000" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch id="allowRegistration" defaultChecked={true} />
            <Label htmlFor="allowRegistration">Allow user registration</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="emailVerification" defaultChecked={true} />
            <Label htmlFor="emailVerification">Require email verification</Label>
          </div>
          <div>
            <Label htmlFor="defaultRole">Default user role</Label>
            <Select defaultValue="user">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Game Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="gamesPerPage">Games per page</Label>
            <Input id="gamesPerPage" type="number" defaultValue="9" />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="featuredGames" defaultChecked={true} />
            <Label htmlFor="featuredGames">Show featured games on homepage</Label>
          </div>
          <div>
            <Label htmlFor="maxImageSize">Maximum image size (MB)</Label>
            <Input id="maxImageSize" type="number" defaultValue="5" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="smtpHost">SMTP Host</Label>
            <Input id="smtpHost" placeholder="smtp.example.com" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="smtpPort">SMTP Port</Label>
              <Input id="smtpPort" type="number" defaultValue="587" />
            </div>
            <div>
              <Label htmlFor="smtpSecurity">Security</Label>
              <Select defaultValue="tls">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="tls">TLS</SelectItem>
                  <SelectItem value="ssl">SSL</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="smtpUsername">Username</Label>
              <Input id="smtpUsername" />
            </div>
            <div>
              <Label htmlFor="smtpPassword">Password</Label>
              <Input id="smtpPassword" type="password" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button variant="outline">Reset to Defaults</Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  )
}
