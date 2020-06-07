---
layout: post
title: Authentication for Azure AD B2C for Windows Desktop Apps
image: /img/aadb2c-windows.png
tags: azure aad b2c microsoft
---
In an effort to alleviate the pain I went through a few weeks ago while trying to setup a **Windows Desktop Application** (WinForms!) for other brave souls, I decided to put together this blog post.

I'll start by saying kudos to all Microsoft teams that put together a ton of documentation on all things Azure - there are lots of documents and samples on GitHub from different teams.

One specific use case, though, isn't very well covered by samples and examples - *"How to setup B2C login in a WinForms Application"*. Through different samples, documents and blog posts I managed to piece together a working application that I am reasonably happy with.

Before I lay down the code, it is important to understand my specific circumstances:
1. I have a Windows Application (WinForms), installed through ClickOnce,
2. The application communicates with a REST API that uses Azure AD B2C for authentication,
3. Authentication has to be done using a B2C custom policy.
4. Users' credentials have to be saved across application sessions,
5. Only one user will ever be using the application on a machine,
6. The authenticated user should not re-enter her credentials for every app session,
7. The user will have the ability to reset his credentials at login time.

Pretty straightforward requirements if you ask me. To make it easy to obtain the authentication details, I set up a static class that will act as a facade for the [MSAL](https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-overview) libraries. This set of libraries are provided by Microsoft and will deal with all the heavy lifting.

The following code is a functioning example of an authentication manager class one would have in their application:

```csharp
using System.Configuration;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Forms;
using Microsoft.Identity.Client;

public sealed class AzureAdAuthentication
{
    // the name of the registry key where the token will be stored.
    private const string TokenKey = "token";

    // The ClientID/ApplicationID of the app registered in the B2C portal 
    // (representing your desktop App.)
    private static readonly string ClientId = ConfigurationManager.AppSettings[nameof(ClientId)];

    // The TenantID of your B2C tenant.
    private static readonly string TenantId = ConfigurationManager.AppSettings[nameof(TenantId)];

    // The redirect URL you assigned to your flows (usually the native redirect URL)
    private static readonly string RedirectUrl = ConfigurationManager.AppSettings[nameof(RedirectUrl)];

    // The URL to your login user flow. Something in the shape of:
    // https://{tenant}.b2clogin.com/tfp/{tenant}.onmicrosoft.com/B2C_1_{sign_in_flow}" 
    private static readonly string SignInAuthority = ConfigurationManager.AppSettings[nameof(SignInAuthority)];

    // The URL to your password reset user flow. Something in the shape of: 
    // https://{tenant}.b2clogin.com/tfp/{tenant}.onmicrosoft.com/B2C_1_{reset_flow}"
    private static readonly string ResetAuthority = ConfigurationManager.AppSettings[nameof(ResetAuthority)];

    // The collection of scopes you want to obtain through the flow. Example:
    // openid https://{tenant}.onmicrosoft.com/back-office/user_impersonation
    [NotNull, ItemNotNull] private static readonly string[] Scopes =
        ConfigurationManager.AppSettings[nameof(Scopes)].Split(' ').ToArray();

    // Simple class that will help us store the token in the registry for later re-use.
    [NotNull] private static readonly Win32Registry Registry = new Win32Registry();

    // The built public application application instance.
    [NotNull] private static readonly IPublicClientApplication PublicClientApplication;

    static Authentication()
    {
        PublicClientApplication = PublicClientApplicationBuilder.Create(ClientId)
            .WithRedirectUri(RedirectUrl)
            .WithB2CAuthority(SignInAuthority)
            .WithTenantId(TenantId)
            .Build();

        // This code will register events that will allow us to save and restore
        // the auth token in registry.
        PublicClientApplication.UserTokenCache.SetBeforeAccess(BeforeAccessNotification);
        PublicClientApplication.UserTokenCache.SetAfterAccess(AfterAccessNotification);
    }

    private static void BeforeAccessNotification(TokenCacheNotificationArgs args)
    {
        args.TokenCache.DeserializeMsalV3(Registry.Get<byte[]>(TokenKey));
    }

    private static void AfterAccessNotification(TokenCacheNotificationArgs args)
    {
        if (args.HasStateChanged)
        {
            Registry.Set(TokenKey, args.TokenCache.SerializeMsalV3());
        }
    }

    // Helper method that invokes the "Reset Password" user flow.
    private static async Task<AuthenticationResult> RequestUserToResetAsync([IAccount account)
    {
        AuthenticationResult authResult = null;
        try
        {
            /* Password reset! */
            authResult = await PublicClientApplication.AcquireTokenInteractive(Scopes)
                .WithAccount(account)
                .WithB2CAuthority(ResetAuthority)
                .WithPrompt(Prompt.NoPrompt)
                .ExecuteAsync();
        }
        catch (MsalException)
        {
        }

        return authResult;
    }

    // Helper method that invokes the 
    private static async Task<AuthenticationResult> RequestUserToLogInAsync(IAccount account)
    {
        // If an account was saved before, we need to notify that credentials expired
        // and the user must re-login.
        if (account != null)
        {
            var reply = MessageBox.Show(
                "The login session has expired. You must re-enter your credentials to continue. Click 'Cancel' to exit the application.",
                "Expired", MessageBoxButtons.OKCancel);

            if (reply == DialogResult.Cancel)
            {
                return null;
            }
        }

        AuthenticationResult authResult = null;
        try
        {
            authResult = await PublicClientApplication.AcquireTokenInteractive(Scopes)
                .WithAccount(account)
                .WithPrompt(Prompt.SelectAccount)
                .ExecuteAsync();
        }
        catch (MsalException error)
        {
            // Catch this special error that means that user clicked on the "Forgot Password" link.
            // We need to invoke the reset flow.
            if (error.Message.StartsWith("AADB2C90118"))
            {
                authResult = await RequestUserToResetAsync(account);
            }
        }

        return authResult;
    }

    // The main method called by all the code in the application
    // to obtain a valid token (JWT) to send to the API.
    public static async Task<string> GetAccessTokenAsync()
    {
        AuthenticationResult authResult;

        // Obtain the one account that is allowed to be logged in.
        var accounts = await PublicClientApplication.GetAccountsAsync();
        var firstAccount = accounts.FirstOrDefault();

        try
        {
            // Try to obtain the token silently (if it's saved in the registry/memory)
            authResult = await PublicClientApplication.AcquireTokenSilent(Scopes, firstAccount)
                .ExecuteAsync();
        }
        catch (MsalUiRequiredException)
        {
            // Any error in this case means we need to ask for authentication
            // explicitly.
            authResult = await RequestUserToLogInAsync(firstAccount);
        }

        return authResult?.AccessToken;
    }

    // Helper method that code can use to drop the current authentication details. 
    public static async Task DropAccessTokenAsync()
    {
        var accounts = await PublicClientApplication.GetAccountsAsync();
        var firstAccount = accounts.FirstOrDefault();
        if (firstAccount != null)
        {
            await PublicClientApplication.RemoveAsync(firstAccount);
        }
    }
}
````

Now, to save and restore token from the registry one would need a simple wrapper class such as this:

```csharp
using System;
using System.Reflection;
using Microsoft.Win32;
using Newtonsoft.Json;

internal class Win32RegistryStorage
{
    private readonly RegistryKey _key;

    public Win32Registry()
    {
        var softwareKey = Registry.CurrentUser.OpenSubKey("Software", true);
        var keyName = Assembly.GetExecutingAssembly().GetName().Name;
        if (softwareKey != null)
        {
            _key = softwareKey.OpenSubKey(keyName, true) ?? softwareKey.CreateSubKey(keyName);
        }
    }

    private string Get(string option, string defaultValue = null)
    {
        if (option == null)
        {
            throw new ArgumentNullException(nameof(option));
        }

        if (_key != null)
        {
            try
            {
                if (_key.GetValueKind(option) == RegistryValueKind.String)
                {
                    return (string) _key.GetValue(option);
                }
            }
            catch
            {
                // ignored
            }
        }

        return defaultValue;
    }

    public T Get<T>(string option, T defaultValue = default(T))
    {
        var result = Get(option);
        if (result != null)
        {
            try
            {
                return JsonConvert.DeserializeObject<T>(result);
            }
            catch
            {
                // nothing...
            }
        }

        return defaultValue;
    }

    private void Set(string option, string value)
    {
        if (option == null)
        {
            throw new ArgumentNullException(nameof(option));
        }

        if (_key != null)
        {
            if (value == null)
            {
                _key.DeleteValue(option);
            }
            else
            {
                _key.SetValue(option, value, RegistryValueKind.String);
            }
        }
    }

    public void Set<T>(string option, T value)
    {
        var content = JsonConvert.SerializeObject(value);
        Set(option, content);
    }
}
```

Not very elegant or too safe but it does the job of illustrating how to have a working authentication with ability to store it across application restarts.

To use the above code, one would simply invoke `AzureAdAuthentication.GetAccessTokenAsync` method. If the result is `null`, it has failed and one should terminate the application or ask the user to try again. If the result is valid, the caller will call the API endpoints providing the JWT token.

In my application's case, the code is a bit more complicated and allows for auth retries, application termination and is neatly included in the _"calling the API flow"_. The calling code doesn't need to worry about any details on how authentication is managed.

**That's it, happy coding!**