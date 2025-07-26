from django.core.management.base import BaseCommand

from ghostwriter.modules.llm import generate_finding


class Command(BaseCommand):
    """Generate a finding using an LLM."""

    help = "Generate finding text using an LLM via the OpenAI API"

    def add_arguments(self, parser):
        parser.add_argument("prompt", help="Prompt describing the finding")
        parser.add_argument(
            "--title",
            default="AI Generated Finding",
            help="Title for the new finding",
        )
        parser.add_argument(
            "--create",
            action="store_true",
            help="Create a new Finding record in the database",
        )

    def handle(self, *args, **options):
        text = generate_finding(options["prompt"])
        self.stdout.write(text)

        if options["create"]:
            from ghostwriter.reporting.models import Finding

            finding = Finding.objects.create(
                title=options["title"],
                description=text,
            )
            self.stdout.write(self.style.SUCCESS(f"Created finding {finding.pk}"))
