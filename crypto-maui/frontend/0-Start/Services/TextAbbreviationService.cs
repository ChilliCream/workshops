namespace MauiCrypto;

static class TextAbbreviationService
{
	public static string ToAbbreviatedText(this int number) => ToAbbreviatedText((int?)number);
	public static string ToAbbreviatedText(this int? number) => ToAbbreviatedText((double?)number);

	public static string ToAbbreviatedText(this long number) => ToAbbreviatedText((long?)number);
	public static string ToAbbreviatedText(this long? number) => ToAbbreviatedText((double?)number);

	public static string ToAbbreviatedText(this double number) => ToAbbreviatedText((double?)number);
	public static string ToAbbreviatedText(this double? number)
	{
		if (number < 10e2)
			return $"{number:0}";
		else if (number < 10e5)
			return $"{number / 10e2:0.0}K";
		else if (number < 10e8)
			return $"{number / 10e5:0.0}M";
		else if (number < 10e11)
			return $"{number / 10e8:0.0}B";
		else if (number < 10e14)
			return $"{number / 10e11:0.0}T";

		throw new NotSupportedException($"Values under {10e14} are not yet supported");
	}
}