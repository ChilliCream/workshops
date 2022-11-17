using CommunityToolkit.Maui.Markup;
using static CommunityToolkit.Maui.Markup.GridRowsColumns;

namespace MauiCrypto;

class SettingsPage : BasePage<SettingsViewModel>
{
	public SettingsPage(SettingsViewModel settingsViewModel) : base(settingsViewModel, "Settings")
	{
		const int separatorRowHeight = 1;
		const int settingsRowHeight = 38;

		Content = new Grid
		{
			RowSpacing = 8,
			ColumnSpacing = 16.5,

			RowDefinitions = Rows.Define(
				(Row.GraphQLEndpoint, settingsRowHeight),
				(Row.UrlSeparator, separatorRowHeight),
				(Row.Username, settingsRowHeight),
				(Row.Password, settingsRowHeight),
				(Row.CredentialsSeparator, separatorRowHeight)),

			ColumnDefinitions = Columns.Define(
				(Column.Icon, 24),
				(Column.Title, 100),
				(Column.Input, Star)),

			Children =
			{
				new Image()
					.Row(Row.GraphQLEndpoint).Column(Column.Icon)
					.Source("links_icon.png"),

				new TitleLabel("Endpoint")
					.Row(Row.GraphQLEndpoint).Column(Column.Title),

				new InputEntry("GraphQL Endpoint Url, eg https://localhost:5001")
					.Row(Row.GraphQLEndpoint).Column(Column.Input)
					.Bind(Entry.TextProperty, nameof(SettingsViewModel.GraphQLEndpointText)),

				new Image()
					.Row(Row.Username).Column(Column.Icon)
					.Source("credentials_icon.png"),

				new TitleLabel("Username")
					.Row(Row.Username).Column(Column.Title),

				new InputEntry("Username")
					.Row(Row.Username).Column(Column.Input)
					.Bind(Entry.TextProperty, nameof(SettingsViewModel.UsernameText)),

				new TitleLabel("Password")
					.Row(Row.Password).Column(Column.Title),

				new InputEntry("Password")
					.Row(Row.Password).Column(Column.Input)
					.Bind(Entry.TextProperty, nameof(SettingsViewModel.PasswordText))
			}
		};
	}

	enum Row { GraphQLEndpoint, UrlSeparator, Username, Password, CredentialsSeparator }
	enum Column { Icon, Title, Input }

	class TitleLabel : Label
	{
		public TitleLabel(in string text)
		{
			Text = text;
			FontSize = 14;

			HorizontalOptions = VerticalOptions = LayoutOptions.Fill;
			VerticalTextAlignment = TextAlignment.Center;
			LineBreakMode = LineBreakMode.TailTruncation;

			this.DynamicResource(TextColorProperty, nameof(BaseTheme.PrimaryTextColor));
		}
	}

	class InputEntry : Entry
	{
		public InputEntry(in string placeholder)
		{
			Placeholder = placeholder;
			FontSize = 12;

			HorizontalOptions = VerticalOptions = LayoutOptions.Fill;
			VerticalTextAlignment = TextAlignment.Center;

			this.DynamicResource(TextColorProperty, nameof(BaseTheme.PrimaryTextColor));
		}
	}
}