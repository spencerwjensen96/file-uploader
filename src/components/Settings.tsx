import React, { useState, useEffect } from 'react';
// import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import cloudflareLogoSrc from '../assets/logos/cloudflare.svg';
import awsLogoSrc from '../assets/logos/aws.svg';
import azureLogoSrc from '../assets/logos/azure.svg';

// Declare the global electron interface
declare global {
  interface Window {
    electron: {
      saveSettings: (settings: any) => Promise<void>;
      loadSettings: () => Promise<any>;
    };
  }
}

interface ISettings {
  cloudProviders: string[];
  storageUrl: string;
  [key: string]: any;
}

const cloudProviders = [
  {
    value: 'cloudflare',
    label: 'Cloudflare',
    logo: cloudflareLogoSrc,
  },
  {
    value: 'aws',
    label: 'Amazon Web Services (AWS)',
    logo: awsLogoSrc,
  },
  { value: 'azure', label: 'Microsoft Azure', logo: azureLogoSrc },
];

export default function Settings() {
  const [originalSettings, setOriginalSettings] = useState<ISettings>(
    {} as ISettings,
  );
  const [activeProvider, setActiveProvider] = useState<string>('');
  const [isActiveProvider, setIsActiveProvider] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [storageUrl, setStorageUrl] = useState('');
  const [region, setRegion] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [secretKey, setSecretKey] = useState('');

  const { toast } = useToast();

  const loadSettingsPage = async () => {
    try {
      const settings = await window.electron.loadSettings();
      setActiveProvider(settings.activeCloudProvider || '');
      setSelectedProvider(
        settings.activeCloudProvider || cloudProviders[0].value,
      );
      setOriginalSettings(settings);

      setStorageUrl(settings[settings.activeCloudProvider].storageUrl || '');
      setRegion(settings[settings.activeCloudProvider].region || '');
      setAccessKey(settings[settings.activeCloudProvider].accessKey || '');
      setSecretKey(settings[settings.activeCloudProvider].secretKey || '');
    } catch (error) {
      console.error('Failed to load settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load settings',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    loadSettingsPage();
  }, []);

  useEffect(() => {
    setIsActiveProvider(
      originalSettings.activeCloudProvider === selectedProvider,
    );
  }, [selectedProvider]);

  const handleProviderToggle = (value: string) => {
    setIsActiveProvider(activeProvider === value);
    setSelectedProvider(value);
    if (!originalSettings[value]) {
      setStorageUrl('');
      setRegion('');
      setAccessKey('');
      setSecretKey('');
      return;
    }
    setStorageUrl(originalSettings[value].storageUrl || '');
    setRegion(originalSettings[value].region || '');
    setAccessKey(originalSettings[value].accessKey || '');
    setSecretKey(originalSettings[value].secretKey || '');
  };

  const handleSave = async () => {
    const settings = {
      ...originalSettings,
      activeCloudProvider: activeProvider,
      [selectedProvider]: {
        storageUrl,
        region,
        accessKey,
        secretKey,
      },
    };
    try {
      await window.electron.saveSettings(settings);
      toast({
        title: 'Success',
        description: 'Settings saved successfully',
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive',
      });
    }
  };
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Cloud Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2 flex-col">
            <Label>Cloud Providers</Label>
            <div className="flex flex-wrap gap-2">
              {cloudProviders.map((provider) => (
                <Button
                  key={provider.value}
                  type="button"
                  variant={
                    selectedProvider === provider.value ? 'default' : 'outline'
                  }
                  className={cn(
                    'flex items-center space-x-2 h-20 w-20 p-3 object-contain',
                    selectedProvider === provider.value &&
                      'ring-2 ring-primary',
                  )}
                  onClick={() => handleProviderToggle(provider.value)}
                >
                  <img src={provider.logo} alt={provider.label} />
                </Button>
              ))}
            </div>
            <Label>
              {cloudProviders
                .filter((selected) => selected.value === selectedProvider)
                .map((selected) => selected.label)}
            </Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActiveProvider"
                checked={isActiveProvider}
                onCheckedChange={(checked) => {
                  setIsActiveProvider(checked as boolean);
                  setActiveProvider(selectedProvider);
                }}
              />
              <Label htmlFor="isActiveProvider">Active</Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="storageUrl">Storage URL + Bucket</Label>
            <Input
              id="storageUrl"
              value={storageUrl}
              onChange={(e) => setStorageUrl(e.target.value)}
              placeholder="Storage URL"
              className={cn('p-2')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="region">Region</Label>
            <Input
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="Region"
              className={cn('p-2')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accessKey">Access Key</Label>
            <Input
              id="accessKey"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              placeholder="Access Key"
              className={cn('p-2')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="secretKey">Secret Key</Label>
            <Input
              id="secretKey"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="Secret Key"
              className={cn('p-2')}
            />
          </div>
          <Button
            type="submit"
            className={cn(
              'w-full p-2',
              'bg-primary text-primary-foreground hover:bg-primary/90',
            )}
          >
            Save Settings
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
