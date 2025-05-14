const { settings } = revenge;
const { getByProps } = cumcord.modules;
const React = cumcord.modules.common.React;

let bannerURL = "";
let avatarDecoURL = "";
let accentColor = "#7289da";

settings.registerPlugin({
  name: "FakeProfileDecorations",
  settings: [
    {
      type: "input",
      label: "Banner URL",
      placeholder: "https://example.com/banner.png",
      get: () => bannerURL,
      set: (val) => (bannerURL = val),
    },
    {
      type: "input",
      label: "Avatar Decoration URL",
      placeholder: "https://example.com/avatar.png",
      get: () => avatarDecoURL,
      set: (val) => (avatarDecoURL = val),
    },
    {
      type: "input",
      label: "Accent Color",
      placeholder: "#7289da",
      get: () => accentColor,
      set: (val) => (accentColor = val),
    },
    {
      type: "custom",
      render: () => {
        return React.createElement("div", {
          children: React.createElement("div", {
            style: {
              padding: 10,
              backgroundColor: accentColor,
              borderRadius: 8,
              color: "#fff",
              marginTop: 10,
              textAlign: "center",
              position: "relative",
            },
            children: [
              bannerURL &&
                React.createElement("img", {
                  src: bannerURL,
                  style: {
                    width: "100%",
                    height: 100,
                    objectFit: "cover",
                    borderRadius: 8,
                    marginBottom: 10,
                  },
                }),
              React.createElement("div", {
                style: { fontWeight: "bold" },
                children: "Live Preview",
              }),
              React.createElement("div", {
                style: { fontSize: 12, marginBottom: 5 },
                children: "This is how your profile will look locally.",
              }),
              avatarDecoURL &&
                React.createElement("img", {
                  src: avatarDecoURL,
                  style: {
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    position: "absolute",
                    top: -24,
                    left: "calc(50% - 24px)",
                    border: "2px solid white",
                    backgroundColor: "#fff",
                  },
                }),
            ],
          }),
        });
      },
    },
  ],
});

function patchProfile() {
  const UserProfile = getByProps("getUserProfile");

  if (!UserProfile) return;

  const original = UserProfile.getUserProfile;
  UserProfile.getUserProfile = (userId) => {
    const profile = original(userId);

    if (userId !== cumcord.modules.common.user.id) return profile;

    profile.banner = bannerURL;
    profile.accentColor = accentColor;
    profile.avatarDecoration = {
      asset: avatarDecoURL,
      id: "local_fake_decoration",
    };

    return profile;
  };
}

patchProfile();